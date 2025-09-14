import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming there's a CSS file for styling

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <h1>欢迎来到Looge幸运团购</h1>
            <p>参与我们的团购活动，赢取丰厚奖品！</p>
            <div className="activities">
                <h2>当前团购活动</h2>
                <ul>
                    <li>
                        <Link to="/GroupPurchase">团购活动1</Link>
                    </li>
                    <li>
                        <Link to="/GroupPurchase">团购活动2</Link>
                    </li>
                    <li>
                        <Link to="/GroupPurchase">团购活动3</Link>
                    </li>
                </ul>
            </div>
            <div className="user-participation">
                <h2>我的参与情况</h2>
                <p>您参与的活动将显示在这里。</p>
            </div>
        </div>
    );
};

export default Home;