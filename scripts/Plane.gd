extends Node2D

@export var speed: float = 220.0
@export var direction: Vector2 = Vector2(1, 0)

func _process(delta):
    position += direction.normalized() * speed * delta
    var view_rect = Rect2(Vector2(-400, -400), Vector2(2400, 1400))
    if not view_rect.has_point(global_position):
        queue_free()
