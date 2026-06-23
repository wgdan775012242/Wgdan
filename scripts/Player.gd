extends CharacterBody2D

@export var speed: float = 220.0
@export var sprite_male: NodePath
@export var sprite_female: NodePath

var using_male := true

func _ready():
    _update_sprite()

func _physics_process(delta):
    var input_vec = Vector2(
        Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left"),
        Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
    )
    if input_vec.length() > 0:
        velocity = input_vec.normalized() * speed
    else:
        velocity = Vector2.ZERO
    move_and_slide()

func _input(event):
    if event.is_action_pressed("switch_player"):
        using_male = not using_male
        _update_sprite()

func _update_sprite():
    if sprite_male and sprite_female:
        var male_node = get_node_or_null(sprite_male)
        var female_node = get_node_or_null(sprite_female)
        if male_node and female_node:
            male_node.visible = using_male
            female_node.visible = not using_male
