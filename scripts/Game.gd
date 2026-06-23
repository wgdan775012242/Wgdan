extends Node2D

@export var taxi_scene: PackedScene
@export var plane_scene: PackedScene
@export var player_node_path: NodePath
@export var taxi_spawn_points_paths: Array = []
@export var music_player_path: NodePath = NodePath("/root/Main/MusicPlayer")
@export var ambience_player_path: NodePath = NodePath("/root/Main/AmbiencePlayer")

var player: Node2D

func _ready():
    player = get_node(player_node_path)
    for ppath in taxi_spawn_points_paths:
        var sp = get_node_or_null(ppath)
        if sp:
            _spawn_taxi(sp.global_position)
    _start_plane_timer()
    _start_audio()

func _spawn_taxi(pos: Vector2):
    if not taxi_scene:
        return
    var t = taxi_scene.instantiate()
    add_child(t)
    t.global_position = pos
    if t.has_method("set_target"):
        t.call("set_target", player)
    else:
        t.target = player

func _start_plane_timer():
    var timer = Timer.new()
    timer.wait_time = 4.0
    timer.autostart = true
    timer.one_shot = false
    add_child(timer)
    timer.connect("timeout", Callable(self, "_on_plane_timer"))

func _on_plane_timer():
    if not plane_scene:
        return
    var p = plane_scene.instantiate()
    add_child(p)
    var y = randi_range(-50, 120)
    var from_left = randi() % 2 == 0
    if from_left:
        p.global_position = Vector2(-100, y)
        p.direction = Vector2(1, 0)
    else:
        p.global_position = Vector2(1400, y)
        p.direction = Vector2(-1, 0)

func _start_audio():
    # play music and ambience if players exist
    var m = get_node_or_null(music_player_path)
    if m and m is AudioStreamPlayer:
        m.play()
    var a = get_node_or_null(ambience_player_path)
    if a and a is AudioStreamPlayer:
        a.play()
