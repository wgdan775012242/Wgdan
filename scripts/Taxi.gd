extends CharacterBody2D

@export var speed: float = 160.0
@export var detection_radius: float = 350.0
var target: Node2D = null

func set_target(t: Node2D) -> void:
    target = t

func _physics_process(delta):
    if not target:
        return
    var to_player = target.global_position - global_position
    var dist = to_player.length()
    if dist <= detection_radius:
        var dir = to_player.normalized()
        velocity = dir * speed
    else:
        velocity = Vector2.ZERO
    move_and_slide()
