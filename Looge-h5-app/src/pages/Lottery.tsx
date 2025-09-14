import React, { useState, useEffect } from 'react';

const Lottery: React.FC = () => {
    const [prizes, setPrizes] = useState<any[]>([]);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchPrizes();
    }, []);

    const fetchPrizes = async () => {
        // Fetch prizes from API
        try {
            const response = await fetch('/api/prizes');
            const data = await response.json();
            setPrizes(data);
        } catch (error) {
            console.error('Error fetching prizes:', error);
        }
    };

    const handleLottery = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/lottery', { method: 'POST' });
            const data = await response.json();
            setResult(data.result);
        } catch (error) {
            console.error('Error during lottery:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>参与抽奖</h1>
            <button onClick={handleLottery} disabled={loading}>
                {loading ? '抽奖中...' : '抽奖'}
            </button>
            {result && <h2>恭喜您！您获得了: {result}</h2>}
            <h2>奖品列表</h2>
            <ul>
                {prizes.map((prize, index) => (
                    <li key={index}>{prize.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Lottery;