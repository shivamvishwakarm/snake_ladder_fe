// components/PlayerInfo.tsx

interface PlayerData {
  name: string;
  position: number;
  started: boolean;
  isCurrentTurn: boolean;
}

interface PlayerInfoProps {
  user: PlayerData;
  bot: PlayerData;
}

export default function PlayerInfo({ user, bot }: PlayerInfoProps) {
  return (
    <div className="h-40 flex flex-col items-center justify-center space-y-6">
      {/* User Info */}
      <div
        className={`flex items-center space-x-4 p-4 rounded-md shadow-md w-64 
                ${
                  user.isCurrentTurn
                    ? "bg-blue-200 border-2 border-blue-500"
                    : "bg-gray-100"
                }`}>
        <div className="playerIcon">
          <div className="playerMarker userMarker"></div>
        </div>
        <div className="playerDetails text-center">
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-sm text-gray-600">
            Position: {user.started ? user.position : "Not started"}
          </p>
        </div>
      </div>

      {/* Bot Info */}
      <div
        className={`flex items-center space-x-4 p-4 rounded-md shadow-md w-64
                ${
                  bot.isCurrentTurn
                    ? "bg-red-200 border-2 border-red-500"
                    : "bg-gray-100"
                }`}>
        <div className="playerIcon">
          <div className="playerMarker botMarker"></div>
        </div>
        <div className="playerDetails text-center">
          <h3 className="font-bold text-lg">{bot.name}</h3>
          <p className="text-sm text-gray-600">
            Position: {bot.started ? bot.position : "Not started"}
          </p>
        </div>
      </div>
    </div>
  );
}
