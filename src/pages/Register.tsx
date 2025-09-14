import React, { useState } from 'react';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () => {
        if (!username || !password || !email) {
            setError('所有字段都是必填的');
            return;
        }

        try {
            // 调用注册API
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('注册成功！请登录。');
                setUsername('');
                setPassword('');
                setEmail('');
                setError('');
            } else {
                setError(data.message || '注册失败，请重试。');
            }
        } catch (err) {
            setError('网络错误，请稍后再试。');
        }
    };

    return (
        <div>
            <h2>用户注册</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="email"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRegister}>注册</button>
        </div>
    );
};

export default Register;