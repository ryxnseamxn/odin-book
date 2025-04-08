const Login = () => {
    return (
        <div>
            <form>
                <h1>
                    Login
                </h1>
                <label htmlFor="username">Username: </label>
                <input 
                    type="text"
                    name="username"
                    id="username"
                />
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                />
            </form>
        </div>
    )
};

export default Login; 