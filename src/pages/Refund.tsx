import React, { useState } from 'react';

const Refund: React.FC = () => {
    const [refundRequest, setRefundRequest] = useState('');
    const [message, setMessage] = useState('');

    const handleRefundRequestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRefundRequest(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the refund request to the backend API
        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setMessage('退款请求已提交成功！');
        } catch (error) {
            setMessage('提交退款请求时出错，请重试。');
        }
    };

    return (
        <div>
            <h1>退款申请</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={refundRequest}
                    onChange={handleRefundRequestChange}
                    placeholder="请输入退款理由"
                    required
                />
                <button type="submit">提交退款申请</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Refund;