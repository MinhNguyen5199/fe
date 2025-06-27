'use client';

interface GameStats {
    xp: number;
    level: number;
    [key: string]: any;
}

interface GremlinProfileProps {
    stats: GameStats;
    username: string;
}

const GremlinProfile = ({ stats, username }: GremlinProfileProps) => {
    if (!stats) return null;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">
                @{username}'s Gremlin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-md">
                    <p className="text-sm text-purple-300 font-semibold">Level</p>
                    <p className="text-2xl font-bold text-white">{stats.level}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-md">
                    <p className="text-sm text-yellow-300 font-semibold">Experience</p>
                    <p className="text-2xl font-bold text-white">{stats.xp} XP</p>
                </div>
            </div>
        </div>
    );
};

export default GremlinProfile;