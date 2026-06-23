extends Node2D

@export var speed: float = 220.0
@export var direction: Vector2 = Vector2(1, 0)
@export var flyby_player_path: NodePath = NodePath("FlybyPlayer")

func _ready():
    # play flyby sound once when spawned
    var p = get_node_or_null(flyby_player_path)
    if p and p is AudioStreamPlayer2D:
        p.play()

func _process(delta):
    position += direction.normalized() * speed * delta
    var view_rect = Rect2(Vector2(-400, -400), Vector2(2400, 1400))
    if not view_rect.has_point(global_position):
        queue_free()
