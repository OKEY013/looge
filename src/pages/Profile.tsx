import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '../api'; // Assuming these API functions are defined
import { UserProfile } from '../types'; // Assuming UserProfile type is defined

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setProfile(data);
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (updatedProfile: UserProfile) => {
        try {
            await updateUserProfile(updatedProfile);
            setProfile(updatedProfile);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            {profile && (
                <div>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    {/* Add more profile fields as necessary */}
                    <button onClick={() => handleUpdate({ ...profile, name: 'New Name' })}>
                        Update Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;