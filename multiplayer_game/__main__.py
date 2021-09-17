import os
import dataclasses

import socketio
import eventlet

from multiplayer_game import SVector, PlayerData

PORT = 80

working_dir = os.path.dirname(os.path.abspath(__file__))
sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': '{}/frontend/'.format(working_dir)
})

sid_to_player_id = {}
player_datas = {}
highest_player_id = -1

import dataclasses, json

class EnhancedJSONEncoder(json.JSONEncoder):
    ''' https://stackoverflow.com/a/51286749/12650706 '''
    def default(self, o):
        if dataclasses.is_dataclass(o):
            return dataclasses.asdict(o)
        return super().default(o)

@sio.event
def connect(sid: str, *args):
    global highest_player_id, sid_to_player_id
    highest_player_id += 1

    new_player_data = PlayerData(highest_player_id, SVector(0, 0))
    player_data_dict = {key:dataclasses.asdict(value) for (key, value) in player_datas.items()}
    sio.emit('set_player_id', highest_player_id, room=sid)
    sio.emit('player_joined', dataclasses.asdict(new_player_data))
    sio.emit('init_other_players', player_data_dict, room=sid)

    player_datas[highest_player_id] = new_player_data
    sid_to_player_id[sid] = highest_player_id

    print('connect', highest_player_id)

@sio.event
def disconnect(sid: str):
    sio.emit('player_left', sid_to_player_id[sid])

    print('disconnect', sid_to_player_id[sid])
    
    del player_datas[sid_to_player_id[sid]]
    del sid_to_player_id[sid]


@sio.event
def update_player_data(sid: str, data: dict):
    player_datas[sid_to_player_id[sid]] = PlayerData(**data)

    player_data_list = list(player_datas.values())
    player_data_list = [dataclasses.asdict(d) for d in player_data_list]

    sio.emit('set_player_datas', player_data_list)

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app, log_output=False)