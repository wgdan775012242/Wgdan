extends CharacterBody2D

@export var speed: float = 160.0
@export var detection_radius: float = 350.0
@export var engine_player_path: NodePath = NodePath("EnginePlayer")
var target: Node2D = null

func set_target(t: Node2D) -> void:
    target = t

func _physics_process(delta):
    if not target:
        _stop_engine()
        return
    var to_player = target.global_position - global_position
    var dist = to_player.length()
    if dist <= detection_radius:
        var dir = to_player.normalized()
        velocity = dir * speed
        _play_engine()
    else:
        velocity = Vector2.ZERO
        _stop_engine()
    move_and_slide()

func _play_engine():
    var p = get_node_or_null(engine_player_path)
    if p and p is AudioStreamPlayer2D and not p.playing:
        p.play()

func _stop_engine():
    var p = get_node_or_null(engine_player_path)
    if p and p is AudioStreamPlayer2D and p.playing:
        p.stop()
