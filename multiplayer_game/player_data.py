from dataclasses import dataclass

from multiplayer_game import SVector

@dataclass
class PlayerData:
    player_id: int
    position: SVector