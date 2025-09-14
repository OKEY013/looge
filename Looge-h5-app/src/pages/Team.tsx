import React from 'react';

const Team: React.FC = () => {
    const [teamMembers, setTeamMembers] = React.useState([]);

    React.useEffect(() => {
        // Fetch team members from API
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch('/api/team-members'); // Replace with actual API endpoint
                const data = await response.json();
                setTeamMembers(data);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        fetchTeamMembers();
    }, []);

    return (
        <div>
            <h1>团队信息</h1>
            <ul>
                {teamMembers.map(member => (
                    <li key={member.id}>
                        {member.name} - {member.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Team;