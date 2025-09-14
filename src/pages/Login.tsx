import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../api'; // 假设有一个API方法用于登录

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser({ username, password });
            if (response.success) {
                // 登录成功，重定向到首页或其他页面
                history.push('/home');
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('登录失败，请重试');
        }
    };

    return (
        <div className="login-container">
            <h2>用户登录</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>用户名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>密码</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">登录</button>
            </form>
        </div>
    );
};

export default Login;