const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require('../services/bucket'); 
const dataSource = require("../db/dataSource");
const Snap = require("../db/entities/Snap");
const snapRepository = dataSource.getRepository(Snap);

exports.snapFriend = async (req, res) => {
    try {
        const newSnap = snapRepository.create({
            filepath: req.file.key, 
            sender: { id: req.user.id }, 
            recipient: { id: req.body.recipientId },
            caption: req.body.caption
        });
        
        await snapRepository.save(newSnap);
        
        res.status(201).json({ message: "Snap sent successfully" });
    } catch (error) {
        console.error("Error sending snap:", error);
        res.status(500).json({ error: error.message });
    }
} 

exports.getPendingSnaps = async (req, res) => {
  try {
    const pendingSnaps = await snapRepository.find({
      where: { recipient: { id: req.user.id }, isOpened: false },
      relations: ["sender"]
    });

    const snapsWithSignedUrl = await Promise.all(pendingSnaps.map(async snap => {
      const command = new GetObjectCommand({
        Bucket: process.env.MINIO_DEFAULT_BUCKET,
        Key: snap.filepath,
      });
      let signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      
      const apiBaseUrl = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.API_URL;
      signedUrl = signedUrl.replace('http://minio:9000', `${apiBaseUrl}/minio-proxy`);

      return { ...snap, imageUrl: signedUrl };
    }));

    res.status(200).json(snapsWithSignedUrl);
  } catch (error) {
    console.error("Error fetching pending snaps:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.markSnapAsViewed = async (req, res) => {
    try {
      const snap = await snapRepository.findOne({ where: { id: req.body.snapId } });
      if (!snap) throw new Error('Snap not found');
      snap.isOpened = true;
      await snapRepository.save(snap);
      res.status(200).json({ message: 'Snap marked as viewed' });
    } catch (error) {
      console.error('Error marking snap as viewed:', error);
      res.status(500).json({ error: error.message });
    }
  };