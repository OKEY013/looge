import React, { useState, useEffect } from 'react';

const Member: React.FC = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch member data from API
        const fetchMembers = async () => {
            try {
                const response = await fetch('/api/members'); // Replace with actual API endpoint
                const data = await response.json();
                setMembers(data);
            } catch (error) {
                console.error('Error fetching member data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const handleUpdateMember = (memberId: string, updatedData: any) => {
        // Logic to update member information
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>会员管理</h1>
            <ul>
                {members.map(member => (
                    <li key={member.id}>
                        <span>{member.name}</span>
                        <button onClick={() => handleUpdateMember(member.id, { /* updated data */ })}>
                            修改资料
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Member;