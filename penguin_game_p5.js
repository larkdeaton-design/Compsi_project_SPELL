// ============================================================
//  S.P.E.L.L. — p5.js conversion
//  Covers: common_room, graduation_ending, hall (hallway),
//          minigame_2 (Divination), minigame_3 (Teleportation),
//          plus all global state, setup, draw, key/mouse handlers,
//          and the supporting sections from every other tab.
//
//  HOW TO RUN:
//    1. Download p5.js from https://p5js.org/download/
//    2. Place this file alongside an index.html that loads p5.js
//       and this sketch (or paste into editor.p5js.org).
//    3. Put all your image/audio assets in the same folder and
//       match the filenames used in setup() / loadImage() calls.
//
//  AUDIO:
//    Processing's SoundFile is replaced with p5.SoundFile from
//    p5.sound.  Include p5.sound.min.js in your HTML.
//    Calls like  intro_music.loop()  and  intro_music.stop()
//    work identically in p5.sound.
//
//  PGRAPHICS → p5.Graphics:
//    createGraphics() is the direct p5.js equivalent.
//    stone / wood are built once in setup() and reused as images.
//
//  COORDINATE SYSTEM / imageMode:
//    Processing defaults to imageMode(CORNER); p5.js also defaults
//    to CORNER.  Every imageMode(CENTER) switch is preserved via
//    push()/pop() around the relevant blocks.
//
//  DIFFERENCES FROM PROCESSING:
//    • color literals like #9CDE41 become '#9CDE41' (string) or
//      color('#9CDE41').
//    • int(x) → int(x) or Math.floor(x) — p5 has int().
//    • key in keyPressed() is the p5 global `key` (string) —
//      same as Processing for single characters.
//    • lerpColor(a, b, t) works identically in p5.js.
//    • rect() corner-radius: p5 uses rect(x,y,w,h, r) same as
//      Processing.
//    • tint() / noTint() work the same.
//    • push() / pop() replace Processing's pushMatrix/popMatrix
//      and also save/restore style (fill, stroke, etc.).
// ============================================================

// ── Global state ──────────────────────────────────────────────
let stone, wood;          // p5.Graphics backgrounds
let move_flag = false;    // renamed from `move` to avoid conflict
let total_wins = 0;

let castle;
let start_game = false;
let show_instructions = false;

let speed_timer = 0, jump_timer = 0, invisible_timer = 0;
let strength_timer = 0, fire_timer = 0;

// ── Sound files ───────────────────────────────────────────────
let intro_music, walk_sound, win_sound, losegame_sound, lose_heart;
let bandage_sound, strength_sound, fire_sound;

// ── World / hall ──────────────────────────────────────────────
const WORLD_WIDTH = 2000;
const STONE_NUM = 20000;
let stone_x = [], stone_y = [], stone_w = [], stone_h = [];
const WOOD_NUM = 1000;
let wood_x = [], wood_y = [], wood_w = [];

let penguin = [];           // 32 frames
let counter = 8;
let px = 200, py = 660;
let direction = 1;
let camera_x = 0;
let door_positions = new Array(8).fill(0);
const room_names = ["Common Room","Flying","Divination","Teleportation",
                    "Potions","Defense","Dueling","Boss Fight"];
let click_flag = false;
let room = -3;
let select_door = -1;

// ── Intro ─────────────────────────────────────────────────────
let tundra, blue_penguin_img, penguin_teacher, letter_img, scroll_img;
let thought_bubble, aquatrain, speech_bubble, pink_penguin, desk;
let scene = 1;

// ── Common room ───────────────────────────────────────────────
let common_room_img;
let pengu_friend = [], pengu_friend2 = [];
let common_scene = -1;
let countpf = 0, countpf2 = 20;

// ── Graduation ────────────────────────────────────────────────
let evil_pengu = [], lightning_imgs = [], grad_pengu = [];
let stage_img, diploma_img, diploma_badge, diploma_scroll_img;
let blue_badge, grad_cap;
let gpx = 0, countgrad = 8, timergp = 0, counte = 0;
let fadeout_flag = true, fade = 0, castle_zoom = 2.0, countl = 0;
let the_end = false;
let end_music, applause_sound, thunder_sound;

// ── Minigame 1 (Flying) ───────────────────────────────────────
let pengu_fly = [];
let g1 = 0;
let object_imgs = [];
let objectX = new Array(10).fill(0), objectY = new Array(10).fill(0);
let objecttype = new Array(10).fill(0);
let currobject = new Array(10).fill(false);
let objectspeed = 25, timer1 = 0;
let px1 = 300, py1 = 200;
let heart_img;
let die_cnt1 = 0, dodgecnt = 0, highscore = 0, wincnt1 = 0;
let died1 = false, win1 = false, exit1 = false;
let losegame_played1 = false;
let game1_music, losegame_sound_ref, lose_heart_ref;

// ── Minigame 2 (Divination puzzle) ───────────────────────────
let grid_x_pos = [245,495,745,245,495,745,245,495,745];
let grid_y_pos = [200,200,200,450,450,450,700,700,700];
let tile_x_pos = new Array(9).fill(0), tile_y_pos = new Array(9).fill(0);
let penguin_puzzle = [];
let tile_placed = new Array(9).fill(false);
let tile_dragging = -1;
let puzzle_count = 0;
let full_puzzle;
let win2 = false, div_scene = 0;
let game2_music, puzzle_sound;

// ── Minigame 3 (Teleportation) ────────────────────────────────
let penguin_concentrate;
let c_penguin_x = 500, c_penguin_y = 660;
let circle_x_pos = 200, circle_y_pos = 700;
let circle_start = 200, circle_shrink = 2;
let score3 = 0, highscore3 = 0, wincnt3 = 0, wrong_clicks = 0;
const max_wrong_clicks = 5;
let game_over3 = false, win_3 = false, exit3 = false, start_game3 = false;
let losegame_played3 = false;
let game3_music;

// ── Minigame 4 (Potions) ──────────────────────────────────────
let cauldron, potions_book;
let ingredient_imgs = [];
const originalX_ing = [100,135,1175,1350,1175,300,300,180,1250,1350];
const originalY_ing = [225,625,200,350,750,725,150,400,500,650];
let ingX = [...originalX_ing], ingY = [...originalY_ing];
let bandage_img, speed_potion_img, jump_potion_img;
let invisible_potion_img, strength_potion_img, fire_potion_img;
let unused4 = new Array(10).fill(true);
let dragging4 = -1;
let potion_color_val, target_color_val;
const ingredient_color_hex = [
  '#FFA00F','#E85805','#FFD700','#E81A51',
  '#FFCEF9','#814F26','#006A63','#896CAA',
  '#AAE5FF','#B690FF'
];
let open_book = false, replenish_cnt = 3;
let used_carrot=false,used_glowberry=false,used_golddust=false,used_melon=false;
let used_pearl=false,used_potato=false,used_seapearl=false,used_stone_ing=false;
let used_teardrop=false,used_zongzi=false;
let inventory_items = new Array(9).fill(0);
let open_inv = false, select_slot = -1;
let inv_type = new Array(9).fill(-1);
let game4_music, ingredient_sound, madepotion_sound;

// ── Minigame 5 (Defense) ──────────────────────────────────────
let penguin_wand = [];
let shield_img, fireball_img;
let wand_counter = 0, shield_count = 0;
let animating = false, shield_summoned = false;
let hp = 100, max_hp = 100;
const num_fireballs = 6;
let fireball_x = [], fireball_y = [], fireball_active = [], fireball_speed_arr = [];
let player_x5 = 300, player_y5 = 700;
const player_r = 60, shield_r = 120;
let shield_x5 = 300, shield_y5 = 670;
let survive_timer = 0, survive_goal = 900;
let win5 = false, game_over5 = false, losegame_played5 = false;
let shield_cooldown = 0, shield_cooldown_max = 60;
let fireballs_blocked = 0, fireballs_hit = 0;
let duel_partner = [], countp2 = 0;
let game5_music, shield_sound;

// ── Minigame 6 (Dueling) ──────────────────────────────────────
let evil_gremlin = [], angel_gremlin = [], wizard_pengu = [];
let spell_active = false;
let countp1 = 0, countg = 0;
let px6 = 200, py6 = 600, speed6 = 5;
let pv6 = 0, jumpforce = 15, jumping6 = false;
let gx = [], originalgx = [], gy = [], gSpeed = 7;
let transformed = new Array(5).fill(false);
let hp6 = 100, max_hp6 = 100;
let blast_count = 0, blast_summoned = false, blast_cooldown = 0;
const blast_cooldown_max = 30;
let blast_radius = 700;
let transformcnt = 0, highscore6 = 0, wincnt6 = 0;
let died6 = false, win6 = false, exit6 = false, losegame_played6 = false;
let game6_music, cast_spell_sound;


// ════════════════════════════════════════════════════════════════
//  PRELOAD — loads all assets before setup()
// ════════════════════════════════════════════════════════════════
function preload() {
  // Sounds (requires p5.sound library)
  // Uncomment and adjust paths as needed:
  // intro_music     = loadSound('intromusic.mp3');
  // walk_sound      = loadSound('walksound.mp3');
  // win_sound       = loadSound('wingame.mp3');
  // losegame_sound  = loadSound('losegame.mp3');
  // lose_heart      = loadSound('loseheart.mp3');
  // bandage_sound   = loadSound('bandagesound.mp3');
  // strength_sound  = loadSound('growsound.mp3');
  // fire_sound      = loadSound('firesound.mp3');
  // game1_music     = loadSound('mariounderground.mp3');
  // game2_music     = loadSound('themesong.mp3');
  // puzzle_sound    = loadSound('puzzlesound.mp3');
  // game3_music     = loadSound('mariounderwater.mp3');
  // game4_music     = loadSound('potionmusic.mp3');
  // ingredient_sound= loadSound('ingredientsound.mp3');
  // madepotion_sound= loadSound('madepotionsound.mp3');
  // game5_music     = loadSound('defensemusic.mp3');
  // shield_sound    = loadSound('shieldsound.mp3');
  // game6_music     = loadSound('hogwartsmusic.mp3');
  // cast_spell_sound= loadSound('castspell.mp3');
  // end_music       = loadSound('endmusic.mp3');
  // applause_sound  = loadSound('applausesound.mp3');
  // thunder_sound   = loadSound('thundersound.mp3');

  // Images
  castle = loadImage('castle.png');

  // Intro
  tundra          = loadImage('tundra.png');
  blue_penguin_img= loadImage('penguin_standing.png');
  penguin_teacher = loadImage('penguin_teacher.png');
  letter_img      = loadImage('letter.png');
  scroll_img      = loadImage('scroll.png');
  thought_bubble  = loadImage('thought_bubble.png');
  aquatrain       = loadImage('aquatrain.png');
  speech_bubble   = loadImage('speech_bubble.png');
  pink_penguin    = loadImage('pink_penguin.png');
  desk            = loadImage('teacher_desk.png');

  // Hallway penguin walk frames
  for (let i = 0; i < 32; i++) {
    penguin[i] = loadImage(`penguwalk-${i}.png`);
  }

  // Common room
  common_room_img = loadImage('commonroom.png');
  for (let i = 0; i < 18; i++) pengu_friend[i]  = loadImage(`pengufriend-${i}.png`);
  for (let i = 0; i < 21; i++) pengu_friend2[i] = loadImage(`pengufriend2-${i}.png`);

  // Minigame 1
  for (let i = 0; i < 31; i++) pengu_fly[i] = loadImage(`flyingpengu-${i}.png`);
  object_imgs[0] = loadImage('drawer.png');
  object_imgs[1] = loadImage('candle.png');
  object_imgs[2] = loadImage('door.png');
  object_imgs[3] = loadImage('table.png');
  object_imgs[4] = loadImage('chair.png');
  heart_img       = loadImage('hearts.png');

  // Minigame 2
  for (let i = 0; i < 9; i++) penguin_puzzle[i] = loadImage(`penguin_puzzle-${i+1}.png`);
  full_puzzle = loadImage('full_puzzle.png');

  // Minigame 3
  penguin_concentrate = loadImage('penguin_concentrate.png');

  // Minigame 4
  cauldron      = loadImage('cauldron.png');
  potions_book  = loadImage('potionsbook.png');
  const ing_names = ['carrot','glowberry','golddust','melon','pearl',
                     'potato','seapearl','stone','teardrop','zongzi'];
  for (let i = 0; i < 10; i++) ingredient_imgs[i] = loadImage(`${ing_names[i]}.png`);
  bandage_img          = loadImage('bandage.png');
  speed_potion_img     = loadImage('speedpotion.png');
  jump_potion_img      = loadImage('jumppotion.png');
  invisible_potion_img = loadImage('invisiblepotion.png');
  strength_potion_img  = loadImage('strengthpotion.png');
  fire_potion_img      = loadImage('firepotion.png');

  // Minigame 5
  for (let i = 0; i < 20; i++) penguin_wand[i] = loadImage(`penguin_with_wand-${i}.png`);
  shield_img   = loadImage('shield.png');
  fireball_img = loadImage('fireball.png');
  for (let i = 0; i < 6; i++) duel_partner[i] = loadImage(`duelpartner-${i}.png`);

  // Minigame 6
  for (let i = 0; i < 5; i++) {
    evil_gremlin[i]  = loadImage(`gremlin1-${i}.png`);
    angel_gremlin[i] = loadImage(`gremlin2-${i}.png`);
  }
  for (let i = 0; i < 16; i++) wizard_pengu[i] = loadImage(`wizardpengu-${i}.png`);

  // Graduation
  stage_img        = loadImage('gradstage.png');
  diploma_img      = loadImage('diploma.png');
  diploma_badge    = loadImage('diplomabadge.png');
  diploma_scroll_img = loadImage('gradscroll.png');
  blue_badge       = loadImage('bluebadge.png');
  grad_cap         = loadImage('gradcap.png');
  for (let i = 0; i < 32; i++) grad_pengu[i]    = loadImage(`penguwalk-${i}.png`);
  for (let i = 0; i < 15; i++) evil_pengu[i]     = loadImage(`evilpengu-${i}.png`);
  for (let i = 0; i < 5;  i++) lightning_imgs[i] = loadImage(`lightning-${i}.png`);
}


// ════════════════════════════════════════════════════════════════
//  SETUP
// ════════════════════════════════════════════════════════════════
function setup() {
  createCanvas(1470, 900);
  frameRate(30);
  imageMode(CORNER);  // default

  // Potion colors
  potion_color_val = color('#9CDE41');
  target_color_val = color('#9CDE41');

  // Door positions (mirrors Processing loop)
  let d = 0;
  for (let i = 50; i < WORLD_WIDTH && d < 7; i += 285) {
    door_positions[d] = i;
    d++;
  }
  door_positions[7] = door_positions[6] + 285; // 8th door

  // ── Stone PGraphics ──
  let stone_counter = 0, sy = 0;
  while (sy < height && stone_counter < STONE_NUM) {
    let sx = -50;
    let rowh = random(40, 60);
    while (sx < WORLD_WIDTH && stone_counter < STONE_NUM) {
      let sw = random(60, 110);
      stone_x[stone_counter] = sx;
      stone_y[stone_counter] = sy;
      stone_w[stone_counter] = sw;
      stone_h[stone_counter] = rowh;
      sx += sw + 2;
      stone_counter++;
    }
    sy += rowh + 2;
  }
  stone = createGraphics(WORLD_WIDTH, 900);
  stone.noStroke();
  for (let i = 0; i < STONE_NUM; i++) {
    if (stone_w[i] > 0) {
      stone.fill(80 + random(10));
      stone.rect(stone_x[i], stone_y[i], stone_w[i], stone_h[i], 5);
    }
  }

  // ── Wood PGraphics ──
  let wood_counter = 0, wy = 0;
  while (wy < height && wood_counter < WOOD_NUM) {
    let wx = -100;
    while (wx < WORLD_WIDTH && wood_counter < WOOD_NUM) {
      let ww = random(250, 500);
      wood_x[wood_counter] = wx;
      wood_y[wood_counter] = wy;
      wood_w[wood_counter] = ww;
      wx += ww;
      wood_counter++;
    }
    wy += 40;
  }
  wood = createGraphics(WORLD_WIDTH, height);
  wood.noStroke();
  for (let i = 0; i < WOOD_NUM; i++) {
    if (wood_w[i] > 0) {
      wood.fill(120, 80, 50);
      wood.rect(wood_x[i], wood_y[i], wood_w[i], 40, 3);
      wood.strokeWeight(2);
      wood.stroke(90, 60, 30, 100);
      wood.line(wood_x[i]+10, wood_y[i]+15, wood_x[i]+wood_w[i]-10, wood_y[i]+15);
      wood.line(wood_x[i]+20, wood_y[i]+25, wood_x[i]+wood_w[i]-30, wood_y[i]+25);
    }
  }

  // Puzzle tile starting positions
  let cnt = 0;
  for (let i = 0; i < 3; i++) {
    for (let y = 0; y < 3; y++) {
      tile_x_pos[cnt] = 900 + (200*i) + 75;
      tile_y_pos[cnt] = 75  + (200*y) + 75;
      tile_placed[cnt] = false;
      cnt++;
    }
  }

  // Minigame 3 start position
  circle_x_pos = random(100, 1400);
  circle_y_pos = random(100, 700);

  // Minigame 5 fireballs
  for (let i = 0; i < num_fireballs; i++) {
    fireball_speed_arr[i] = random(8, 12);
    fireball_x[i] = random(200, width + 2000);
    fireball_y[i] = random(650, 750);
    fireball_active[i] = true;
  }

  // Minigame 6 gremlins
  for (let i = 0; i < 5; i++) {
    gx[i] = 1470 + (i * 300);
    originalgx[i] = gx[i];
    gy[i] = 700;
    transformed[i] = false;
  }
}


// ════════════════════════════════════════════════════════════════
//  DRAW
// ════════════════════════════════════════════════════════════════
function draw() {
  imageMode(CORNER);
  textAlign(LEFT, BASELINE);

  if (room === -3) {
    if (!show_instructions) start_screen();
    else instructions_screen(-3);
  } else if (room === -2) {
    intro_sequence();
    show_instructions = true;
  } else if (room === -1) {
    hall();
  } else if (room === 0) {
    common_room();
  } else if (room === 1) {
    instructions_screen(1);
    if (!show_instructions) minigame1();
  } else if (room === 2) {
    if (total_wins >= 1) {
      instructions_screen(2);
      if (!show_instructions) minigame_2();
    } else { room = -1; }
  } else if (room === 3) {
    if (total_wins >= 2) {
      instructions_screen(3);
      if (!show_instructions) minigame_3();
    } else { room = -1; }
  } else if (room === 4) {
    if (total_wins >= 3) {
      instructions_screen(4);
      if (!show_instructions) { minigame4(); total_wins = 4; }
    } else { room = -1; }
  } else if (room === 5) {
    if (total_wins >= 4) {
      instructions_screen(5);
      if (!show_instructions) minigame_5();
    } else { room = -1; }
  } else if (room === 6) {
    if (total_wins >= 5) {
      instructions_screen(6);
      if (!show_instructions) minigame_6();
    } else { room = -1; }
  } else if (room === 7) {
    graduation_ending();
  }

  // ── Inventory overlay ──
  if (open_inv) {
    push();
    imageMode(CENTER);
    fill(0, 150);
    noStroke();
    rect(-2, 0, 1473, 900);
    for (let i = 0; i < 9; i++) {
      stroke(255);
      fill(select_slot === i ? color('#69ACE8') : 50);
      let slotX = 295 + (i * 100);
      rect(slotX, 750, 80, 80, 5);
      if (inventory_items[i] > 0) {
        let img = null;
        if      (inv_type[i] === 1) img = bandage_img;
        else if (inv_type[i] === 2) img = speed_potion_img;
        else if (inv_type[i] === 3) img = jump_potion_img;
        else if (inv_type[i] === 4) img = invisible_potion_img;
        else if (inv_type[i] === 5) img = strength_potion_img;
        else if (inv_type[i] === 6) img = fire_potion_img;
        if (img) image(img, slotX + 40, 790, 60, 60);
        fill(255);
        textSize(18);
        textAlign(RIGHT);
        text(inventory_items[i], slotX + 75, 825);
        textAlign(LEFT);
      }
      fill(200);
      textSize(12);
      noStroke();
      text(i + 1, slotX + 5, 765);
    }
    pop();
  }
}


// ════════════════════════════════════════════════════════════════
//  INTRO SEQUENCE
// ════════════════════════════════════════════════════════════════
function intro_sequence() {
  // if (intro_music && !intro_music.isPlaying()) intro_music.loop();

  if (scene === 1) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("You were a young penguin,\nliving life freely in the tundra, hunting fish, sliding on icebergs,\n and staying with your flock of penguins.", 735, 450);
    textSize(20);
    text("Press space to continue.", 200, 800);
  }
  if (scene === 2) {
    push(); imageMode(CENTER);
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("However, one day, a letter arrived...", 735, 450);
    pop();
  }
  if (scene === 3) {
    push(); imageMode(CENTER);
    image(tundra, 800, 450, 1600, 900);
    image(blue_penguin_img, 450, 720);
    image(letter_img, 520, 750, 72.5, 60);
    pop();
  }
  if (scene === 4) {
    push(); imageMode(CENTER);
    image(tundra, 735, 450, 1600, 900);
    image(blue_penguin_img, 450, 720);
    image(scroll_img, 735, 450);
    fill(0);
    textSize(11);
    textAlign(LEFT, CENTER);
    text("Hello and welcome, dear penguin! \n We would like to invite you to our prestigious academy: \n the Society for Penguin Enchantment, Learning & Lore \n (S.P.E.L.L.)! You have displayed magical talent before, and \n we wish to help you hone that ability. At S.P.E.L.L. you will \n learn the essential skills for life as a magical penguin, such as \n Flying, Divination, Teleportation, Potions, Defense and Dueling. \n Of course, you are not obligated to accept our proposition, \n but if you do not, it is highly possible that your magic may \n make you a danger to yourself and others. If you decide to \n attend S.P.E.L.L., please purchase a wand and other necessities \n (see enclosed list) and be at the aquatrain platform at the \n next full moon. \n We hope to see you soon. ", 600, 415);
    pop();
  }
  if (scene === 5) {
    push(); imageMode(CENTER);
    textAlign(CENTER, CENTER);
    image(tundra, 800, 450, 1600, 900);
    image(blue_penguin_img, 450, 720);
    image(letter_img, 520, 750, 72.5, 60);
    image(thought_bubble, 270, 550, 300, 200);
    fill(0);
    textSize(11);
    textAlign(CENTER, CENTER);
    text("Oh wow! \n I can't belive that I'm a wizard! \n I definitely want to go to S.P.E.L.L.! \n I guess I go should buy my stuff quickly!", 270, 535);
    pop();
  }
  if (scene === 6) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("You go to buy all of your school equipment. A month later, \n you are at the aquatrain platform all ready for your wizard training.", 735, 450);
  }
  if (scene >= 7 && scene <= 19) {
    push(); imageMode(CENTER);
    image(aquatrain, 800, 450, 1600, 900);
    image(blue_penguin_img, 450, 720);
    if (scene >= 8) image(pink_penguin, 250, 720, 175, 250);
    // Speech bubbles per scene
    const bubbleSide = [null, null, null, null, null, null, null,
      400, 200, 400, 200, 200, 400, 200, 400, 200, 200, 400, 200, 400];
    const bubbleTexts = [null,null,null,null,null,null,null,
      "Okay, I think i'm ready to go. \n I'm so excited to see S.P.E.L.L.!",
      "Hi! \n Are you also going to \n S.P.E.L.L. this year?",
      "Yes, and I'm so excited. \n I never knew that I was a \n wizard!",
      "Me neither, but I know that \n I'm going to be \n the best witch ever!!",
      "I heard that S.P.E.L.L. \n is really dangerous though. \n I hope that we'll be okay.",
      "Dangerous? \n What do you mean?",
      "Well, I heard that \n there's a 'dark emperor' \n terrorizing all the wizards.",
      "Well, you are going to be \n the best witch ever right? \n If anyone can defeat him \n it's you.",
      "That's nice, \n but we've still \n got a lot to learn.",
      "I doubt either of us is going \n to be a hero without being \n a good mage first.",
      "I don't know. I'm not super \n worried about heroics. \n The older penguins will \n keep us safe.",
      "I hope so. \n We should go \n get on the aquatrain. \n See you around!",
      "Bye!"
    ];
    let bx = bubbleSide[scene];
    let by = 620;
    if (bx !== null) {
      image(speech_bubble, bx, by, 200, 200);
      fill(0);
      textSize(11);
      textAlign(CENTER, CENTER);
      text(bubbleTexts[scene], bx, by - 10);
    }
    pop();
  }
  if (scene === 20) {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("After a long train ride, you arrive at S.P.E.L.L. \n and head to go talk to the headmaster.", 735, 450);
  }
  if (scene === 21 || scene === 22 || scene === 23 || scene === 24) {
    background(0);
    imageMode(CORNER);
    image(stone, 0, 0);
    image(wood, 0, 800);
    push();
    imageMode(CENTER);
    image(penguin_teacher, 200, 550, 200, 200);
    image(desk, 200, 700);
    image(blue_penguin_img, 1000, 700);
    // Flipped speech bubble
    translate(350, 450);
    scale(-1, 1);
    translate(-350, -450);
    image(speech_bubble, 350, 450);
    pop();
    const headTexts = {
      21: "Hello new scholar! I think I speak for everyone \n here when I say that we are so happy \n to have you here at S.P.E.L.L. \n Study hard, do well in your exams, \n learn the essential skills \n and you will surely become a great wizard.",
      22: "You will start learning the essential skills \n with flying, and then move \n down the line of classrooms. \n Don't go out of order, \n or you won't be able to take the exam.",
      23: "Additionally, you will have access to the common room, \n where you can spend time with your friends. \n You can go to the common room whenever you want.",
      24: "Finally, I have heard rumors \n about a certain 'dark emperor'. \n He is NOT a threat, and please don't \n concern yourself with this matter. \n Have fun, and enjoy your classes. \n Good Luck!"
    };
    textSize(11);
    fill(0);
    textAlign(CENTER, CENTER);
    text(headTexts[scene], 350, 440);
  }
  if (scene === 25) {
    room = -1;
    // if (intro_music) intro_music.stop();
  }

  // Skip button
  push();
  fill(100);
  stroke(255);
  rect(1250, 775, 150, 50, 10);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Skip story", 1325, 800);
  pop();
}


// ════════════════════════════════════════════════════════════════
//  HALLWAY
// ════════════════════════════════════════════════════════════════
function hall() {
  imageMode(CORNER);
  background(0);
  camera_x = px - 1000;
  camera_x = max(0, camera_x);
  stroke(40);
  strokeWeight(2);

  push();
  translate(-camera_x, 0);
  image(stone, 0, 0);
  for (let i = 50; i < WORLD_WIDTH; i += 285) {
    draw_door(i, 450);
  }
  image(wood, 0, 800);
  if (total_wins >= 6) {
    image(diploma_img, 1790, 200, 150, 200);
    image(diploma_badge, 1870, 320, 50, 50);
    image(blue_badge, 1800, 250, 75, 90);
  }
  pop();

  let screen_x = px - camera_x;
  push();
  if (direction === -1) {
    translate(screen_x + 100, py);
    scale(-1, 1);
    translate(-screen_x - 100, -py);
  }
  image(penguin[counter], screen_x, py);
  if (total_wins >= 6) {
    image(grad_cap, screen_x + 35, py - 10, 120, 50);
  }
  pop();

  click_flag = false;
  for (let i = 0; i < door_positions.length; i++) {
    let dx = door_positions[i];
    if (px + 80 > dx && px < dx + 200) {
      let box_screen = dx - camera_x + 100;
      go_box(box_screen, 400, "go to " + room_names[i]);
      if (mouseX > box_screen - 105 && mouseX < box_screen + 105
          && mouseY > 400 && mouseY < 450) {
        click_flag = true;
        select_door = i;
      }
      break;
    }
  }

  if (move_flag) {
    counter = (counter + 1) % penguin.length;
    py = 650;
    // if (walk_sound && !walk_sound.isPlaying()) walk_sound.loop();
    if (keyIsDown(65)) { px -= 15; direction = -1; }  // A
    if (keyIsDown(68)) { px += 15; direction = 1; }   // D
  } else {
    // if (walk_sound) walk_sound.stop();
    counter = 8;
    py = 660;
  }
  px = max(-50, px);
}

function draw_door(x, y) {
  fill(120, 80, 50);
  noStroke();
  rect(x, y, 200, 350);
  fill(212, 175, 55);
  circle(x + 30, y + 200, 25);
}

function go_box(x, y, label) {
  stroke(255);
  strokeWeight(2);
  fill(0, 0, 0, 210);
  rect(x - 105, y, 210, 50, 8);
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x, y + 25);
  textAlign(LEFT, BASELINE);
}


// ════════════════════════════════════════════════════════════════
//  COMMON ROOM
// ════════════════════════════════════════════════════════════════
function common_room() {
  imageMode(CORNER);
  image(common_room_img, 0, 0);
  push();
  imageMode(CENTER);
  image(pengu_friend[countpf], 230, 700, 300, 300);
  image(pengu_friend2[countpf2], 1200, 680, 300, 300);
  image(pink_penguin, 680, 700, 150, 210);
  pop();

  fill(100);
  noStroke();
  rect(20, 20, 120, 40, 5);
  fill(255);
  textSize(16);
  textAlign(LEFT, BASELINE);
  text("RETURN", 49, 47);

  if (common_scene === 0) {
    countpf = (countpf + 1) % pengu_friend.length;
    push();
    imageMode(CENTER);
    translate(350, 510);
    scale(-1, 1);
    image(speech_bubble, 0, 0);
    pop();
    push();
    imageMode(CENTER);
    translate(440, 730);
    scale(-1, 1);
    image(penguin[8], 0, 0, 250, 250);
    pop();
    fill(0);
    textAlign(LEFT, TOP);
    text("Hi there! I see you have decided \n to attend S.P.E.L.L. I hope you \n enjoy your first year here.", 230, 485);
  }
  if (common_scene === 1) {
    countpf2 = (countpf2 + 1) % pengu_friend.length;
    push();
    imageMode(CENTER);
    image(speech_bubble, 1100, 550, 450, 450);
    image(penguin[8], 1010, 720, 250, 250);
    pop();
    fill(0);
    textAlign(LEFT, TOP);
    text("Hiya! Pssst- I know you just arrived, \n but this may be our last year here- \n apparently the Dark Emperor is going \n to infiltrate our school. Enjoy the time \n while you can! SEE YOU LATER!!", 965, 500);
  }
  if (common_scene === 2) {
    push();
    imageMode(CENTER);
    translate(750, 520);
    scale(-1, 1);
    image(speech_bubble, 0, 0);
    pop();
    push();
    imageMode(CENTER);
    translate(850, 730);
    scale(-1, 1);
    image(penguin[8], 0, 0, 250, 250);
    pop();
    fill(0);
    textAlign(LEFT, TOP);
    text("Nice to see you again! We \n should meet up sometime this \n year!", 635, 495);
  }
}


// ════════════════════════════════════════════════════════════════
//  GRADUATION ENDING
// ════════════════════════════════════════════════════════════════
function graduation_ending() {
  // if (end_music && !end_music.isPlaying()) end_music.loop();
  // if (applause_sound && !applause_sound.isPlaying()) applause_sound.play();

  imageMode(CORNER);
  image(stage_img, 0, 0);

  if (gpx >= 480 && timergp < 20) {
    push(); 
    image(blue_penguin_img, 500, 650, 130, 185);
    image(grad_cap, 495, 640, 135, 45);
    image(speech_bubble, 280, 380);
    fill(0);
    textAlign(LEFT, TOP);
    text("I had a really good time attending \n S.P.E.L.L. See everyone next year!", 350, 540);
    image(diploma_scroll_img, 570, 730, 100, 100);
    pop();
    countgrad = 8;
    gpx = 480;
    timergp++;
  } else if (gpx >= 1600) {
    // if (applause_sound) applause_sound.stop();
    if (fadeout_flag) {
      fade += 15;
      if (fade >= 255) { fade = 255; fadeout_flag = false; }
    } else {
      background(0);
      push();
      scale(castle_zoom);
      image(castle, 0, 0);
      pop();
      if (castle_zoom > 1.0) castle_zoom -= 0.05;
      if (castle_zoom <= 1.0 && !the_end) {
        tint(0);
        push(); 
        image(evil_pengu[counte], 1100, 580, 400, 400);
        pop();
        noTint();
        if (counte >= 9) {
          if (countl < lightning_imgs.length) {
            // if (thunder_sound && !thunder_sound.isPlaying()) thunder_sound.play();
            push(); 
            image(lightning_imgs[countl], 200, -100, 700, 1000);
            pop();
            countl++;
          }
        }
        counte++;
        if (counte >= evil_pengu.length) the_end = true;
      }
      if (the_end) {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(50);
        text("THE END", width/2, height/2);
      }
      fade -= 15;
      if (fade <= 0) fade = 0;
    }
    if (!the_end) {
      fill(0, fade);
      noStroke();
      rect(-100, -100, 2000, 2000);
    }
  } else {
    push(); 
    image(grad_pengu[countgrad], gpx, 650, 200, 200);
    image(grad_cap, gpx + 30, 640, 125, 50);
    pop();
    countgrad = (countgrad + 1) % grad_pengu.length;
    gpx += 15;
    if (timergp >= 20) {
      push(); 
      image(diploma_scroll_img, gpx + 40, 730, 100, 100);
      pop();
    }
  }
}


// ════════════════════════════════════════════════════════════════
//  MINIGAME 1 — Flying
// ════════════════════════════════════════════════════════════════
function minigame1() {
  background(0);
  // if (!game1_music.isPlaying()) game1_music.loop();
  imageMode(CORNER);
  image(stone, 0, 0);
  push(); 
  image(pengu_fly[g1], px1, py1, 200, 200);
  pop();

  if (die_cnt1 < 1) { push();  image(heart_img, 1320,  50, 100, 100); pop(); }
  if (die_cnt1 < 2) { push();  image(heart_img, 1210,  50, 100, 100); pop(); }
  if (die_cnt1 < 3) { push();  image(heart_img, 1100,  50, 100, 100); pop(); }

  fill(255); textSize(30);
  text("SCORE: " + dodgecnt, 850, 75);
  text("HIGH SCORE: " + highscore, 850, 115);

  if (!died1 && !win1) {
    g1 = (g1 + 1) % pengu_fly.length;
    if (move_flag) {
      if (keyIsDown(87)) py1 -= 25;   // W
      if (keyIsDown(83)) py1 += 25;   // S
      if (keyIsDown(65)) px1 -= 20;   // A
      if (keyIsDown(68)) px1 += 20;   // D
    }
    if (frameCount % 60 === 0) objectspeed += 5;
    timer1++;
    if (timer1 > 10) {
      for (let i = 0; i < currobject.length; i++) {
        if (!currobject[i]) {
          objectX[i] = 1700; objectY[i] = random(0, 700);
          objecttype[i] = int(random(5));
          currobject[i] = true; timer1 = 0; break;
        }
      }
    }
    for (let i = 0; i < currobject.length; i++) {
      if (currobject[i]) {
        objectX[i] -= objectspeed;
        push(); 
        image(object_imgs[objecttype[i]], objectX[i], objectY[i], 200, 200);
        pop();
        if (objectX[i] < -200) {
          currobject[i] = false; dodgecnt++;
          highscore = max(highscore, dodgecnt);
          if (dodgecnt >= 30 && wincnt1 < 1 && !win1) {
            win1 = true; total_wins = 1;
          }
        }
        if (dist(objectX[i]+100, objectY[i]+100, px1+100, py1+100) < 110) {
          // if (lose_heart) lose_heart.play();
          die_cnt1++;
          currobject[i] = false;
          if (die_cnt1 >= 3) died1 = true;
        }
      }
    }
  } else if (died1) {
    // if (game1_music) game1_music.stop();
    // if (!losegame_played1) { losegame_sound.play(); losegame_played1 = true; }
    fill(0, 200); rect(435, 250, 600, 400, 20);
    fill(100); rect(635, 480, 200, 60, 10);
    fill(255); textSize(40); textAlign(CENTER, CENTER);
    text("GAME OVER", 735, 400);
    textSize(20); text("RESTART", 735, 515);
  } else if (win1 && wincnt1 < 1) {
    // if (game1_music) game1_music.stop();
    // if (!win_sound.isPlaying()) win_sound.loop();
    fill(0, 200); rect(435, 250, 600, 400, 20);
    fill(255); textSize(40); textAlign(CENTER, CENTER);
    text("FLYING EXAMS: PASSED", 735, 380);
    fill(100); rect(500, 470, 200, 60, 10); rect(770, 470, 200, 60, 10);
    fill(255); textSize(20);
    text("CONTINUE", 600, 505); text("RETURN", 870, 505);
  }
  if (exit1) {
    fill(100); stroke(255); rect(20, 20, 120, 40, 5);
    fill(255); textSize(18); textAlign(LEFT, BASELINE);
    text("RETURN", 49, 47);
  }
  px1 = constrain(px1, 0, 1400);
  py1 = constrain(py1, 0, 700);
}

function reset_game1() {
  // if (win_sound) win_sound.stop();
  die_cnt1 = 0; dodgecnt = 0; exit1 = false; died1 = false; win1 = false;
  px1 = 300; py1 = 200; objectspeed = 30;
  for (let i = 0; i < currobject.length; i++) currobject[i] = false;
}


// ════════════════════════════════════════════════════════════════
//  MINIGAME 2 — Divination (Puzzle)
// ════════════════════════════════════════════════════════════════
function minigame_2() {
  background(20);
  imageMode(CORNER);
  image(wood, 0, 0);
  // if (!game2_music.isPlaying()) game2_music.loop();

  if (!win2) {
    stroke(2);
    for (let i = 0; i < 4; i++) {
      line(120, 75 + (i*250), 870, 75 + (250*i));
      line(120 + (i*250), 75, 120 + (i*250), 825);
    }
    for (let i = 0; i < 9; i++) {
      let sz = tile_placed[i] ? 250 : 150;
      push(); 
      image(penguin_puzzle[i], tile_x_pos[i] - 75, tile_y_pos[i] - 75, sz, sz);
      pop();
    }
    if (tile_placed.every(v => v)) {
      win2 = true;
      total_wins = 2;
    }
  }

  if (win2) {
    imageMode(CORNER);
    image(full_puzzle, 120, 75, 750, 750);
    rectMode(CORNER);

    // Flip speech bubble helper
    const flipBubble = () => {
      push();
      translate(800, 100);
      scale(-1, 1);
      translate(-800, -100);
      push();  image(speech_bubble, 800, 100); pop();
      pop();
    };

    const divTexts = [
      "I see...",
      "A great and terrible future...",
      "Gremlins sent by HIM, \n invading SPELL",
      "And.. and you! You are..  \n you are fighting them off!",
      "Study well, young penguin! \n You will need those skills \n in the days to come..."
    ];
    if (div_scene <= 4) {
      flipBubble();
      textSize(12);
      fill(0);
      textAlign(LEFT, TOP);
      text(divTexts[div_scene] || "", 550, 270);
    }
    if (div_scene >= 5) {
      fill(255); textSize(40); textAlign(LEFT, TOP);
      text("DIVINATION EXAMS: PASSED", 900, 120);
      fill(100); stroke(255);
      rect(1050, 165, 200, 70, 5);
      fill(255); textSize(30);
      text("RETURN", 1150, 210);
    }
  }
}


// ════════════════════════════════════════════════════════════════
//  MINIGAME 3 — Teleportation (Focus circle click)
// ════════════════════════════════════════════════════════════════
function minigame_3() {
  // if (!game3_music.isPlaying()) game3_music.loop();
  start_game3 = true;
  background(20);
  imageMode(CORNER);
  image(wood, 0, 0);

  // Hearts
  push(); 
  if (wrong_clicks < 1) image(heart_img, 1320, 50, 100, 100);
  if (wrong_clicks < 2) image(heart_img, 1210, 50, 100, 100);
  if (wrong_clicks < 3) image(heart_img, 1100, 50, 100, 100);
  if (wrong_clicks < 4) image(heart_img,  990, 50, 100, 100);
  if (wrong_clicks < 5) image(heart_img,  880, 50, 100, 100);
  pop();

  if (!game_over3 && !win_3) {
    push(); 
    image(penguin_concentrate, c_penguin_x, c_penguin_y, 200, 200);
    pop();
    circle_start -= circle_shrink;
    if (circle_start < 10) circle_start = 200;
    imageMode(CORNER);
    focus_circle(circle_x_pos, circle_y_pos, circle_start);
  }

  textSize(30); fill(0);
  textAlign(CENTER, CENTER);
  text("SCORE: " + score3, 630, 85);
  text("HIGH SCORE: " + highscore3, 630, 125);

  if (score3 >= 25 && wincnt3 < 1 && !win_3) {
    win_3 = true; total_wins = 3;
  }
  if (wrong_clicks >= max_wrong_clicks) game_over3 = true;

  if (win_3) {
    // if (game3_music) game3_music.stop();
    // if (!win_sound.isPlaying()) win_sound.loop();
    start_game3 = false;
    stroke(255); fill(0, 200); rect(435, 250, 600, 400, 20);
    fill(255); textSize(40); textAlign(CENTER, CENTER);
    text("TELEPORTATION EXAMS: ", 735, 370);
    text("PASSED", 735, 420);
    fill(100); rect(500, 470, 200, 60, 10); rect(770, 470, 200, 60, 10);
    fill(255); textSize(20);
    text("CONTINUE", 600, 505); text("RETURN", 870, 505);
  } else if (game_over3) {
    // if (game3_music) game3_music.stop();
    // if (!losegame_played3) { losegame_sound.play(); losegame_played3 = true; }
    start_game3 = false;
    stroke(255); fill(0, 200); rect(435, 250, 600, 400, 20);
    fill(100); rect(635, 480, 200, 60, 10);
    fill(255); textSize(40); textAlign(CENTER, CENTER);
    text("GAME OVER", 735, 400);
    textSize(20); text("RESTART", 735, 515);
  }
  if (exit3) {
    fill(100); stroke(255); rect(20, 20, 120, 40, 5);
    fill(255); textSize(18); textAlign(LEFT, BASELINE);
    text("RETURN", 50, 47);
  }
}

function focus_circle(x, y, starting_size) {
  noFill();
  stroke(0);
  circle(x, y, 150);
  circle(x, y, 100);
  stroke(color('#FF0A0A'));
  circle(x, y, starting_size);
}

function reset_game3() {
  // if (win_sound) win_sound.stop();
  score3 = 0; wrong_clicks = 0;
  circle_start = 200; circle_shrink = 2;
  game_over3 = false; win_3 = false;
}


// ════════════════════════════════════════════════════════════════
//  MINIGAME 4 — Potions
// ════════════════════════════════════════════════════════════════
function minigame4() {
  push();
  // if (!game4_music.isPlaying()) game4_music.loop();
  background(20);
  imageMode(CORNER);
  image(wood, 0, 0);

  potion_color_val = lerpColor(potion_color_val, target_color_val, 0.1);
  push(); imageMode(CENTER);
  image(cauldron, 735, 450, 900, 800);
  pop();

  stroke(255); fill(100);
  rect(1230, 30, 220, 75, 10);
  push(); imageMode(CENTER); image(potions_book, 1415, 68, 50, 50); pop();
  fill(255); textSize(25); textAlign(LEFT, BASELINE);
  text("Potions book", 1240, 75);
  noStroke();
  fill(potion_color_val);
  ellipse(730, 450, 650, 650);

  push(); imageMode(CENTER);
  for (let i = 0; i < ingredient_imgs.length; i++) {
    if (unused4[i]) image(ingredient_imgs[i], ingX[i], ingY[i], 150, 150);
  }
  pop();

  fill(100); stroke(255);
  rect(20, 20, 155, 50, 10);
  fill(255); textSize(25);
  if (replenish_cnt <= 0) {
    text("Return", 63, 52);
  } else {
    text("Replenish (" + replenish_cnt + ")", 30, 52);
  }

  if (open_book) {
    background(100);
    noStroke();
    fill(color('#5D3F11'));
    rect(100, 65, 640, 770, 30); rect(730, 65, 640, 770, 30);
    fill(color('#E5CCA9'));
    rect(135, 100, 600, 700, 20); rect(735, 100, 600, 700, 20);
    fill(255); textSize(20);
    text("Press 'f' to open inventory, then 'e' to use selected", 525, 40);

    // Recipes (abbreviated — mirror of Processing original)
    push(); imageMode(CENTER);
    // Bandage
    image(ingredient_imgs[3],220,200,100,100); image(ingredient_imgs[7],370,200,100,100);
    image(ingredient_imgs[8],500,200,100,100); image(bandage_img,640,175,100,100);
    // Speed
    image(ingredient_imgs[1],210,450,100,100); image(ingredient_imgs[6],355,450,100,100);
    image(ingredient_imgs[0],490,450,100,100); image(speed_potion_img,640,425,100,100);
    // Jump
    image(ingredient_imgs[2],210,700,100,100); image(ingredient_imgs[5],355,700,100,100);
    image(ingredient_imgs[9],500,700,100,100); image(jump_potion_img,640,675,100,100);
    // Invisibility
    image(ingredient_imgs[4],830,200,100,100); image(ingredient_imgs[6],970,200,100,100);
    image(ingredient_imgs[9],1100,200,100,100); image(invisible_potion_img,1250,175,100,100);
    // Strength
    image(ingredient_imgs[7],830,450,100,100); image(ingredient_imgs[2],970,450,100,100);
    image(ingredient_imgs[4],1105,450,100,100); image(strength_potion_img,1250,425,100,100);
    // Fire
    image(ingredient_imgs[0],840,700,100,100); image(ingredient_imgs[8],960,700,100,100);
    image(ingredient_imgs[1],1090,700,100,100); image(fire_potion_img,1250,675,100,100);
    pop();

    fill(0); textSize(20); textAlign(CENTER, CENTER);
    text("Bandage for health",560,250); text("Speed potion",590,500);
    text("Jump potion",590,750); text("Invisibility potion",1175,250);
    text("Strength potion",1185,500); text("Fire-resistant potion",1160,750);

    textSize(40);
    for (let row of [[280,210],[440,210],[270,460],[425,460],[270,710],[425,710],
                     [890,210],[1025,210],[890,460],[1030,460],[900,710],[1000,710]]) {
      text("+", row[0], row[1]);
    }
    for (let row of [[540,210],[555,460],[555,710],[1155,210],[1160,460],[1160,710]]) {
      text("=", row[0], row[1]);
    }

    fill(100); stroke(255); rect(20, 20, 90, 35, 10);
    fill(255); textSize(25); textAlign(LEFT, BASELINE);
    text("Return", 30, 45);
  }
  pop();
}

function addtoinv(itemID) {
  // if (!madepotion_sound.isPlaying()) madepotion_sound.play();
  let placed_inv = false;
  for (let i = 0; i < inventory_items.length; i++) {
    if (inv_type[i] === itemID) { inventory_items[i]++; placed_inv = true; break; }
  }
  if (!placed_inv) {
    for (let i = 0; i < inventory_items.length; i++) {
      if (inv_type[i] === -1) { inv_type[i] = itemID; inventory_items[i]++; placed_inv = true; break; }
    }
  }
}

function replenish_ingredients() {
  for (let i = 0; i < ingredient_imgs.length; i++) {
    unused4[i] = true;
    ingX[i] = originalX_ing[i];
    ingY[i] = originalY_ing[i];
  }
}


// ════════════════════════════════════════════════════════════════
//  MINIGAME 5 — Defense
// ════════════════════════════════════════════════════════════════
function minigame_5() {
  // if (!game5_music.isPlaying()) game5_music.loop();
  imageMode(CORNER);
  background(120);
  image(stone, 0, 0);
  image(wood, 0, 800);
  push(); imageMode(CENTER);
  image(penguin_wand[wand_counter], player_x5, player_y5, 200, 200);
  image(duel_partner[countp2], 1300, 700, 225, 225);
  pop();
  if (frameCount % 3 === 0) countp2 = (countp2 + 1) % duel_partner.length;

  if (shield_summoned) {
    tint(255, 128);
    push(); imageMode(CENTER); image(shield_img, shield_x5, shield_y5, 300, 300); pop();
    noTint();
    shield_count++;
    let duration = (strength_timer > 0) ? 240 : 120;
    if (shield_count > duration) {
      shield_count = 0; wand_counter = 0; shield_summoned = false;
      shield_cooldown = shield_cooldown_max;
    }
  }
  if (animating) {
    // if (!shield_sound.isPlaying()) shield_sound.play();
    wand_counter++;
    if (wand_counter > 19) {
      wand_counter = 19; animating = false; shield_summoned = true;
    }
  }
  if (!win5 && !game_over5) {
    survive_timer++;
    if (fire_timer > 0) fire_timer--;
    if (strength_timer > 0) strength_timer--;
    if (speed_timer > 0) speed_timer--;
    if (shield_cooldown > 0) shield_cooldown--;
    for (let i = 0; i < num_fireballs; i++) {
      if (fireball_active[i]) fireball_x[i] -= fireball_speed_arr[i];
    }
    respawn_fireballs();
    collision_testing5();
    if (survive_timer >= survive_goal && !win5) {
      win5 = true; total_wins = 5;
    }
    if (hp <= 0) { hp = 0; game_over5 = true; }
  }
  push(); imageMode(CENTER);
  for (let i = 0; i < num_fireballs; i++) {
    if (fireball_active[i]) image(fireball_img, fireball_x[i], fireball_y[i], 40, 40);
  }
  pop();
  hp_bar5(); draw_shield_bar(); draw_display5();

  if (win5) {
    // if (game5_music) game5_music.stop();
    // if (!win_sound.isPlaying()) win_sound.loop();
    stroke(255); fill(0, 200); rect(435, 250, 600, 400, 20);
    fill(255); textSize(40); textAlign(CENTER, CENTER);
    text("DEFENSE EXAMS: PASSED", 735, 400);
    fill(100); rect(640, 470, 200, 60, 10);
    fill(255); textSize(20); text("RETURN", 740, 505);
  }
  if (game_over5) {
    // if (game5_music) game5_music.stop();
    // if (!losegame_played5) { losegame_sound.play(); losegame_played5 = true; }
    fill(0, 200); stroke(255); rect(435, 250, 600, 400, 20);
    fill(100); rect(640, 470, 200, 60, 10);
    fill(255); noStroke(); textSize(40); textAlign(CENTER, CENTER);
    text("GAME OVER", 735, 400);
    textSize(20); text("RESTART", 740, 505);
  }
}

function respawn_fireballs() {
  for (let i = 0; i < num_fireballs; i++) {
    if (!fireball_active[i] || fireball_x[i] < -50) {
      fireball_x[i] = 1250;
      fireball_y[i] = 700 + random(-50, 50);
      fireball_speed_arr[i] = random(4, 8) * (1.25 + survive_timer / 500.0);
      fireball_active[i] = true;
    }
  }
}

function collision_testing5() {
  for (let i = 0; i < num_fireballs; i++) {
    if (!fireball_active[i]) continue;
    if (shield_summoned && dist(fireball_x[i], fireball_y[i], shield_x5, shield_y5) < shield_r) {
      fireball_active[i] = false; fireballs_blocked++;
    } else if (dist(fireball_x[i], fireball_y[i], player_x5, player_y5) < player_r) {
      if (fire_timer <= 0) {
        // if (lose_heart) lose_heart.play();
        hp -= 3; fireballs_hit++;
      }
      fireball_active[i] = false;
    }
  }
}

function draw_shield_bar() {
  let cd_x=70, cd_y=height-100, cd_w=400, cd_h=18;
  fill(0); textSize(14); textAlign(LEFT, BASELINE);
  text("SHIELD", cd_x, cd_y - 3);
  fill(80); noStroke(); rect(cd_x, cd_y, cd_w, cd_h, 4);
  if (shield_summoned) {
    let aw = map(shield_count, 0, 120, cd_w, 0);
    fill(80,160,255); rect(cd_x, cd_y, aw, cd_h, 4);
    fill(255); textSize(12); textAlign(CENTER,CENTER);
    text("ACTIVE", cd_x+cd_w/2, cd_y+cd_h/2);
  } else if (shield_cooldown === 0 && !animating) {
    fill(80,220,255); rect(cd_x, cd_y, cd_w, cd_h, 4);
    fill(255); textSize(12); textAlign(CENTER,CENTER);
    text("READY  —  press 'q'", cd_x+cd_w/2, cd_y+cd_h/2);
  } else {
    let rw = map(shield_cooldown, shield_cooldown_max, 0, 0, cd_w);
    fill(70,100,170); rect(cd_x, cd_y, rw, cd_h, 4);
    fill(180); textSize(12); textAlign(CENTER,CENTER);
    text("RECHARGING...", cd_x+cd_w/2, cd_y+cd_h/2);
  }
}

function draw_display5() {
  let seconds_left = max(0, int((survive_goal - survive_timer) / 30) + 1);
  fill(255); textSize(32); textAlign(CENTER, TOP);
  text(seconds_left + "s", width/2, 20);
  textAlign(RIGHT, TOP);
  text("BLOCKED: " + fireballs_blocked + "   HIT: " + fireballs_hit, width-60, 90);
  textAlign(LEFT, BASELINE);
}

function hp_bar5() {
  let bx=1150, by=40, bw=300, bh=30;
  let fw = map(hp, 0, max_hp, 0, bw);
  fill(255); textSize(18); textAlign(LEFT,BASELINE); text("HP", bx, by-4);
  fill(80); noStroke(); rect(bx, by, bw, bh, 6);
  fill(60,200,80); rect(bx, by, fw, bh, 6);
  fill(255); textSize(16); textAlign(CENTER,CENTER);
  text(hp + " / " + max_hp, bx+bw/2, by+bh/2);
}

function reset_game5() {
  hp=100; survive_timer=0; survive_goal=1350; wand_counter=0; shield_count=0;
  animating=false; shield_summoned=false; win5=false; game_over5=false;
  losegame_played5=false; shield_cooldown=0; fireballs_blocked=0; fireballs_hit=0;
  for (let i=0; i<num_fireballs; i++) {
    fireball_speed_arr[i]=random(8,12);
    fireball_x[i]=random(width, width+2000);
    fireball_y[i]=random(620,780);
    fireball_active[i]=true;
  }
}


// ════════════════════════════════════════════════════════════════
//  MINIGAME 6 — Dueling
// ════════════════════════════════════════════════════════════════
function minigame_6() {
  // if (!game6_music.isPlaying()) game6_music.loop();
  imageMode(CORNER);
  background(20);
  image(stone, 0, 0);
  image(wood, 0, 700);

  if (invisible_timer > 0) tint(255, 100);
  push(); imageMode(CENTER);
  image(wizard_pengu[countp1], px6, py6, 300, 300);
  pop(); noTint();

  if (frameCount % 5 === 0) countg = (countg+1) % evil_gremlin.length;

  if (!died6 && !win6) {
    if (speed_timer>0) { speed_timer--; speed6=10; } else speed6=5;
    if (jump_timer>0) { jump_timer--; jumpforce=22; } else jumpforce=15;
    if (strength_timer>0) { strength_timer--; blast_radius=1000; } else blast_radius=700;
    if (invisible_timer>0) invisible_timer--;

    if (move_flag) {
      if (frameCount%6===0) countp1 = (countp1+1) % wizard_pengu.length;
      if (keyIsDown(65)) px6 -= speed6;
      if (keyIsDown(68)) px6 += speed6;
    }
    if (jumping6) {
      py6 -= pv6; pv6 -= 0.8;
      if (py6 > 600) { py6=600; pv6=0; jumping6=false; }
    }
    if (spell_active) {
      // if (!cast_spell_sound.isPlaying()) cast_spell_sound.play();
      if (frameCount%3===0) countp1 = (countp1+1) % wizard_pengu.length;
      blast_count += 5;
      if (blast_count > 120) { blast_count=0; blast_cooldown=blast_cooldown_max; spell_active=false; }
    }
    if (blast_cooldown > 0) blast_cooldown -= 2;

    for (let i=0; i<5; i++) {
      gx[i] -= gSpeed;
      if (!transformed[i] && abs(gx[i]-px6)<80 && abs(gy[i]-(py6+120))<80) {
        if (invisible_timer <= 0) {
          // if (lose_heart) lose_heart.play();
          hp6 -= 5; gx[i]=1770; transformed[i]=false;
        }
      }
      if (hp6 <= 0) { hp6=0; died6=true; }
      if (gx[i] < -100) { gx[i]=1470+(i*300); transformed[i]=false; gSpeed+=0.5; }
      push(); imageMode(CENTER);
      if (transformed[i]) image(angel_gremlin[countg], gx[i], gy[i], 75, 100);
      else                 image(evil_gremlin[countg],  gx[i], gy[i], 75, 100);
      pop();
    }
  }

  hp_bar6();
  draw_blast_bar();
  textAlign(LEFT, TOP);
  textSize(30);
  text("SCORE: " + transformcnt, 910, 35);
  text("HIGH SCORE: " + highscore6, 910, 75);

  // Blast circle
  noFill();
  stroke(strength_timer > 0 ? color('#FFD700') : color('#5FBBFF'));
  strokeWeight(2);
  circle(px6-25, py6+15, blast_radius);
  noStroke();

  if (died6) {
    fill(0,200); stroke(255); strokeWeight(1.5); rect(435,250,600,400,20);
    fill(100); rect(640,470,200,60,10);
    fill(255); textSize(40); textAlign(CENTER,CENTER);
    text("GAME OVER",735,400);
    textSize(20); text("RESTART",740,492);
  } else if (win6) {
    wincnt6++;
    fill(0,200); stroke(255); strokeWeight(1.5); rect(435,250,600,400,20);
    fill(255); textSize(40); textAlign(CENTER,CENTER);
    text("DUELING EXAMS: PASSED",735,380);
    fill(100); rect(500,470,200,60,10); rect(770,470,200,60,10);
    fill(255); textSize(20);
    text("CONTINUE",600,492); text("RETURN",870,492);
  }
  if (exit6) {
    fill(100); stroke(255); strokeWeight(1.5); rect(20,20,120,40,5);
    fill(255); textSize(18); textAlign(LEFT,BASELINE);
    text("RETURN",49,33);
  }
  px6 = constrain(px6, 70, 1450);
}

function hp_bar6() {
  let bx=1140, by=50, bw=300, bh=30;
  let fw = map(hp6, 0, max_hp6, 0, bw);
  fill(255); textSize(18); textAlign(LEFT,BASELINE); text("HP", bx, by-4);
  fill(80); noStroke(); rect(bx, by, bw, bh, 6);
  fill(60,200,80); rect(bx, by, fw, bh, 6);
  fill(255); textSize(16); textAlign(CENTER,CENTER);
  text(hp6 + " / " + max_hp6, bx+bw/2, by+bh/2);
}

function draw_blast_bar() {
  let cd_x=70, cd_y=800, cd_w=400, cd_h=18;
  fill(0); textSize(14); textAlign(LEFT,BASELINE);
  text("BLAST", cd_x, cd_y-3);
  fill(80); noStroke(); rect(cd_x, cd_y, cd_w, cd_h, 4);
  if (spell_active) {
    let aw = map(blast_count, 0, 120, cd_w, 0);
    fill(80,160,255); rect(cd_x, cd_y, aw, cd_h, 4);
    fill(255); textSize(12); textAlign(CENTER,CENTER);
    text("ACTIVE", cd_x+cd_w/2, cd_y+cd_h/2);
  } else if (blast_cooldown === 0) {
    fill(80,220,255); rect(cd_x, cd_y, cd_w, cd_h, 4);
    fill(255); textSize(12); textAlign(CENTER,CENTER);
    text("READY  —  press 'r'", cd_x+cd_w/2, cd_y+cd_h/2);
  } else {
    let rw = map(blast_cooldown, blast_cooldown_max, 0, 0, cd_w);
    fill(70,100,170); rect(cd_x, cd_y, rw, cd_h, 4);
    fill(180); textSize(12); textAlign(CENTER,CENTER);
    text("RECHARGING...", cd_x+cd_w/2, cd_y+cd_h/2);
  }
}

function reset_game6() {
  // if (win_sound) win_sound.stop();
  px6=300; py6=600; gSpeed=5; transformcnt=0; hp6=100;
  died6=false; exit6=false; win6=false;
}


// ════════════════════════════════════════════════════════════════
//  START SCREEN
// ════════════════════════════════════════════════════════════════
function start_screen() {
  imageMode(CORNER);
  textAlign(CENTER, BASELINE);
  background(20);
  image(castle, 0, 0);
  fill(255); textSize(100);
  text("S.P.E.L.L.", 735, 450);
  fill(100); stroke(255);
  rect(170, 675, 300, 100, 10);
  rect(1050, 675, 250, 100, 10);
  fill(255); textSize(55); text("How to play", 320, 745);
  textSize(60); text("START", 1175, 745);
}


// ════════════════════════════════════════════════════════════════
//  INSTRUCTIONS
// ════════════════════════════════════════════════════════════════
function instructions_screen(r) {
  imageMode(CORNER);
  textAlign(CENTER, BASELINE);
  background(20);
  fill(100); stroke(255);

  const configs = {
    '-3': { bg: 'stone', btnX:1100, btnY:685, btnW:200, btnH:80, btnLabel:"Return", btnTSize:55,
            title:"Welcome to S.P.E.L.L.!", tSize:100,
            lines:[
              [210,350,"You will be completing 6 minigames throughout the whole game."],
              [210,420,"You may enter the common room to meet new people."],
              [210,490,"Use 'w' 'a' 's' 'd' to move."],
              [210,560,"Press 'f' to see your inventory and press 'e' to use a selected item."],
              [210,630,"In minigame 6, you will be able to jump."],
              [210,700,"Press space to jump."]
            ]},
    '1':  { bg:'stone', title:"Welcome to Flying!", lines:[
              [265,380,"You will be dodging flying objects while on a broomstick."],
              [265,450,"You have 3 lives. Once you pass, you may choose to keep playing"],
              [265,500,"the minigame or move on to the next door."],
              [265,570,"Use 'w' 'a' 's' 'd' to move."]]},
    '2':  { bg:'wood',  title:"Welcome to Divination!", lines:[
              [125,420,"Complete the puzzle by dragging and dropping into the correct spot."],
              [125,500,"You have unlimited tries."]]},
    '3':  { bg:'wood',  title:"Welcome to Teleportation!", lines:[
              [125,360,"Click the red circle when it is in between the two black circles."],
              [125,430,"You have 5 lives. If you click wrong, you lose a life."],
              [125,500,"However, you may wait as long as you like before clicking."],
              [125,570,"Once you pass, you may choose to keep playing or move on"],
              [125,620,"to the next door."]]},
    '4':  { bg:'wood',  title:"Welcome to Potions!", lines:[
              [200,360,"Drag and drop the ingredients into the cauldron to create items you"],
              [200,410,"can use later."],
              [200,480,"There will be a potions book you can access to see recipes."],
              [200,550,"Press 'f' to open your inventory and see your potions, then press 'e'"],
              [200,600,"to use when selected."]]},
    '5':  { bg:'stone', title:"Welcome to Defense!", lines:[
              [180,380,"Press 'q' to create a shield and avoid getting hit by incoming fireballs."],
              [180,450,"Press 'f' to see your inventory and press 'e' to use a selected item."],
              [180,520,"You may use bandages, speed, jump, invisibility, and strength potions."],
              [180,590,"You have 100 health."]]},
    '6':  { bg:'stone', title:"Welcome to Dueling!", titleY:150, lines:[
              [170,260,"Some gremlins under the dark emperor have infiltrated into the castle."],
              [170,310,"Press 'r' when an evil gremlin is in your blast radius (the blue circle)"],
              [170,360,"to turn them into angel gremlins."],
              [170,410,"Your health will decrease when you get hit by an evil gremlin."],
              [170,450,"You have 100 health."],
              [170,500,"Press 'f' to see your inventory and press 'e' to use a selected item."],
              [170,550,"You may use bandages, speed, jump, invisibility, and strength potions."],
              [170,600,"Use 'w' 'a' 's' 'd' to move. Press space to jump."],
              [170,650,"Once you pass, you may choose to keep playing or"],
              [170,690,"move on to the next door."]]}
  };

  const key_s = String(r);
  const cfg = configs[key_s];
  if (!cfg) return;

  if (cfg.bg === 'stone') image(stone, 0, 0);
  else                    image(wood, 0, 0);

  if (r !== -3) {
    rect(1075, 675, 250, 100, 10);
    fill(255); textSize(60);
    text("START", 1200, 745);
  } else {
    rect(cfg.btnX, cfg.btnY, cfg.btnW, cfg.btnH, 10);
    fill(255); textSize(cfg.btnTSize || 55);
    text(cfg.btnLabel || "Return", cfg.btnX + cfg.btnW/2, cfg.btnY + cfg.btnH - 10);
  }

  fill(255); textSize(100);
  text(cfg.title, 735, cfg.titleY || 200);

  textSize(40); textAlign(LEFT, BASELINE);
  for (const ln of cfg.lines) text(ln[2], ln[0], ln[1]);
}


// ════════════════════════════════════════════════════════════════
//  KEY PRESSED
// ════════════════════════════════════════════════════════════════
function keyPressed() {
  // Movement flag
  if (['w','a','s','d'].includes(key)) move_flag = true;

  // Inventory
  if (key === 'f') open_inv = !open_inv;
  if (key >= '1' && key <= '9') {
    let pressed = int(key) - 1;
    select_slot = (select_slot === pressed) ? -1 : pressed;
  }

  // Use inventory item
  if (key === 'e') {
    if (select_slot !== -1 && inventory_items[select_slot] > 0) {
      let t = inv_type[select_slot];
      if      (t === 1) { /* bandage_sound.play(); */
        if (room === 5) hp  = min(hp  + 5, 100);
        else if (room === 6) hp6 = min(hp6 + 5, 100);
      }
      else if (t === 2) speed_timer    = 300;
      else if (t === 3) jump_timer     = 300;
      else if (t === 4) invisible_timer = 150;
      else if (t === 5) strength_timer = 300;
      else if (t === 6) fire_timer     = 150;
      inventory_items[select_slot]--;
      if (inventory_items[select_slot] <= 0) inv_type[select_slot] = -1;
    }
  }

  // Intro space
  if (room === -2 && key === ' ') scene++;

  // Common room space
  if (room === 0 && key === ' ') common_scene++;

  // Minigame 5 — shield
  if (key === 'q') {
    if (!animating && !shield_summoned && shield_cooldown === 0 && !win5 && !game_over5) {
      animating = true;
    } else if (!animating && shield_summoned) {
      wand_counter = 0; shield_summoned = false;
      shield_count = 0; shield_cooldown = shield_cooldown_max;
    }
  }

  // Minigame 6 — jump and blast
  if (room === 6) {
    if (key === ' ' && !jumping6) { pv6 = jumpforce; jumping6 = true; }
    if (key === 'r' && blast_cooldown === 0 && !spell_active) {
      spell_active = true; blast_count = 0;
      for (let i = 0; i < 5; i++) {
        if (dist(px6-25, py6+15, gx[i], gy[i]) < 350) {
          if (!transformed[i]) {
            transformcnt++;
            highscore6 = max(highscore6, transformcnt);
            if (transformcnt >= 30 && wincnt6 < 1 && !win6) {
              win6 = true; total_wins = 6;
            }
          }
          transformed[i] = true;
        }
      }
    }
  }
  return false; // prevent default browser behavior for arrow keys etc.
}

function keyReleased() {
  move_flag = false;
  return false;
}


// ════════════════════════════════════════════════════════════════
//  MOUSE PRESSED
// ════════════════════════════════════════════════════════════════
function mousePressed() {
  // Hall door entry
  if (click_flag && select_door !== -1) {
    room = select_door;
    // if (walk_sound) walk_sound.stop();
  }

  // Inventory slot click
  if (open_inv) {
    for (let i = 0; i < 9; i++) {
      let slotX = 295 + (i * 100);
      if (mouseX > slotX && mouseX < slotX+80 && mouseY > 750 && mouseY < 830) {
        select_slot = (select_slot === i) ? -1 : i;
        return;
      }
    }
  }

  // Start screen
  if (room === -3) {
    if (show_instructions) {
      if (mouseX > 1100 && mouseX < 1300 && mouseY > 685 && mouseY < 765)
        show_instructions = false;
    } else {
      if (mouseX > 170 && mouseX < 470 && mouseY > 675 && mouseY < 775)
        show_instructions = true;
      else if (mouseX > 1050 && mouseX < 1300 && mouseY > 675 && mouseY < 775)
        room = -2;
    }
  }

  // Intro skip
  if (room === -2) {
    if (mouseX > 1250 && mouseX < 1400 && mouseY > 775 && mouseY < 825)
      scene = 25;
  }

  // Instructions START button
  if (show_instructions && room > 0 && room < 7) {
    if (mouseX > 1075 && mouseX < 1325 && mouseY > 675 && mouseY < 775)
      show_instructions = false;
  }

  // Graduation diploma click
  if (room === -1 && total_wins >= 6) {
    if (mouseX > 1790 - camera_x && mouseX < 1930 - camera_x
        && mouseY > 200 && mouseY < 400)
      room = 7;
  }

  // Common room
  if (room === 0) {
    if (mouseX > 20 && mouseX < 140 && mouseY > 20 && mouseY < 60) {
      room = -1; common_scene = -1;
    }
    if (mouseX > 80  && mouseX < 380  && mouseY > 530 && mouseY < 830) common_scene = 0;
    if (mouseX > 1050 && mouseX < 1350 && mouseY > 500 && mouseY < 800) common_scene = 1;
    if (mouseX > 605 && mouseX < 755  && mouseY > 595 && mouseY < 805) common_scene = 2;
  }

  // Minigame 1
  if (room === 1) {
    if (died1) {
      if (mouseX > 635 && mouseX < 835 && mouseY > 480 && mouseY < 540) {
        reset_game1(); losegame_played1 = false;
      }
      if (wincnt1 >= 1) exit1 = true;
    } else if (win1) {
      exit1 = true;
      if (mouseX > 500 && mouseX < 700 && mouseY > 470 && mouseY < 530) {
        win1 = false; wincnt1 = 1; /* win_sound.stop(); */
      }
      if (mouseX > 770 && mouseX < 970 && mouseY > 470 && mouseY < 530) {
        room = -1; reset_game1(); show_instructions = true;
      }
    }
    if (exit1) {
      if (mouseX > 20 && mouseX < 140 && mouseY > 20 && mouseY < 60) {
        room = -1; reset_game1(); show_instructions = true;
      }
    }
  }

  // Minigame 2
  if (room === 2) {
    for (let i = 0; i < 9; i++) {
      if (!tile_placed[i]) {
        if (dist(mouseX, mouseY, tile_x_pos[i], tile_y_pos[i]) < 75)
          tile_dragging = i;
      }
    }
    if (win2) {
      div_scene++;
      if (mouseX > 1050 && mouseX < 1250 && mouseY > 200 && mouseY < 270) {
        room = -1; /* game2_music.stop(); */ show_instructions = true;
      }
    }
  }

  // Minigame 3
  if (room === 3) {
    if (win_3) {
      exit3 = true;
      if (mouseX > 500 && mouseX < 700 && mouseY > 470 && mouseY < 530) {
        win_3 = false; exit3 = true; wincnt3 = 1; /* win_sound.stop(); */
      }
      if (mouseX > 770 && mouseX < 970 && mouseY > 470 && mouseY < 530) {
        room = -1; exit3 = true; reset_game3();
        /* game3_music.stop(); */ show_instructions = true;
      }
    }
    if (exit3) {
      if (mouseX > 20 && mouseX < 140 && mouseY > 20 && mouseY < 60) {
        /* lose_heart.stop(); game3_music.stop(); */
        room = -1; reset_game1(); start_game3 = false;
        show_instructions = true; return;
      }
    }
    if (game_over3) {
      if (mouseX > 635 && mouseX < 835 && mouseY > 480 && mouseY < 540) {
        reset_game3(); losegame_played3 = false;
      }
    }
    if (room === 3 && start_game3) {
      let d = dist(mouseX, mouseY, circle_x_pos, circle_y_pos);
      let hit = false;
      if (circle_start < 150 && circle_start > 100 && d < 50) {
        c_penguin_x = circle_x_pos; c_penguin_y = circle_y_pos;
        circle_x_pos = random(100, 1400); circle_y_pos = random(100, 700);
        circle_shrink += 0.25; score3++;
        highscore3 = max(highscore3, score3); hit = true;
      }
      if (!hit) { wrong_clicks++; /* lose_heart.play(); */ }
    }
  }

  // Minigame 4
  if (room === 4) {
    for (let i = ingredient_imgs.length - 1; i >= 0; i--) {
      if (unused4[i]) {
        if (dist(mouseX, mouseY, ingX[i], ingY[i]) < 75) {
          dragging4 = i; break;
        }
      }
    }
    if (mouseX > 1230 && mouseX < 1450 && mouseY > 30 && mouseY < 105)
      open_book = true;
    if (open_book) {
      if (mouseX > 20 && mouseX < 110 && mouseY > 20 && mouseY < 55)
        open_book = false;
    } else {
      if (mouseX > 20 && mouseX < 175 && mouseY > 20 && mouseY < 70) {
        if (replenish_cnt > 0) { replenish_cnt--; replenish_ingredients(); }
        else { room = -1; /* game4_music.stop(); */ show_instructions = true; }
      }
    }
  }

  // Minigame 5
  if (room === 5) {
    if (game_over5) {
      if (mouseX > 640 && mouseX < 840 && mouseY > 470 && mouseY < 530) reset_game5();
    }
    if (win5) {
      if (mouseX > 640 && mouseX < 840 && mouseY > 470 && mouseY < 530) {
        room = -1; /* win_sound.stop(); */ show_instructions = true;
      }
    }
  }

  // Minigame 6
  if (room === 6) {
    if (died6) {
      if (mouseX > 640 && mouseX < 840 && mouseY > 470 && mouseY < 530) {
        reset_game6(); losegame_played6 = false;
      }
      if (wincnt6 >= 1) exit6 = true;
    } else if (win6) {
      exit6 = true;
      if (mouseX > 500 && mouseX < 700 && mouseY > 470 && mouseY < 530) {
        win6 = false; wincnt6 = 1; /* win_sound.stop(); */
      }
      if (mouseX > 770 && mouseX < 970 && mouseY > 470 && mouseY < 530) {
        room = -1; reset_game6(); show_instructions = true;
      }
    }
    if (exit6) {
      if (mouseX > 20 && mouseX < 140 && mouseY > 20 && mouseY < 60) {
        room = -1; reset_game6(); show_instructions = true;
      }
    }
  }
}


// ════════════════════════════════════════════════════════════════
//  MOUSE DRAGGED
// ════════════════════════════════════════════════════════════════
function mouseDragged() {
  // Minigame 2
  if (room === 2 && tile_dragging !== -1) {
    tile_x_pos[tile_dragging] = mouseX;
    tile_y_pos[tile_dragging] = mouseY;
  }
  // Minigame 4
  if (room === 4 && dragging4 !== -1) {
    ingX[dragging4] = mouseX;
    ingY[dragging4] = mouseY;
  }
}


// ════════════════════════════════════════════════════════════════
//  MOUSE RELEASED
// ════════════════════════════════════════════════════════════════
function mouseReleased() {
  // Minigame 2 — snap tile to grid
  if (room === 2 && tile_dragging !== -1) {
    let i = tile_dragging;
    let d = dist(tile_x_pos[i], tile_y_pos[i], grid_x_pos[i], grid_y_pos[i]);
    if (d < 100) {
      tile_x_pos[i] = grid_x_pos[i] - 50;
      tile_y_pos[i] = grid_y_pos[i] - 50;
      tile_placed[i] = true;
      // if (!puzzle_sound.isPlaying()) puzzle_sound.play();
    }
    tile_dragging = -1;
  }

  // Minigame 4 — drop ingredient into cauldron
  if (room === 4 && dragging4 !== -1) {
    if (dist(mouseX, mouseY, 735, 450) < 325) {
      // if (!ingredient_sound.isPlaying()) ingredient_sound.play();
      unused4[dragging4] = false;
      target_color_val = color(ingredient_color_hex[dragging4]);
      if (dragging4 === 0) used_carrot    = true;
      if (dragging4 === 1) used_glowberry = true;
      if (dragging4 === 2) used_golddust  = true;
      if (dragging4 === 3) used_melon     = true;
      if (dragging4 === 4) used_pearl     = true;
      if (dragging4 === 5) used_potato    = true;
      if (dragging4 === 6) used_seapearl  = true;
      if (dragging4 === 7) used_stone_ing = true;
      if (dragging4 === 8) used_teardrop  = true;
      if (dragging4 === 9) used_zongzi    = true;

      if (used_melon    && used_stone_ing && used_teardrop)  { addtoinv(1); used_melon=used_stone_ing=used_teardrop=false; }
      if (used_glowberry && used_seapearl && used_carrot)    { addtoinv(2); used_glowberry=used_seapearl=used_carrot=false; }
      if (used_golddust  && used_potato   && used_zongzi)    { addtoinv(3); used_golddust=used_potato=used_zongzi=false; }
      if (used_pearl     && used_seapearl && used_zongzi)    { addtoinv(4); used_pearl=used_seapearl=used_zongzi=false; }
      if (used_stone_ing && used_golddust && used_pearl)     { addtoinv(5); used_stone_ing=used_golddust=used_pearl=false; }
      if (used_carrot    && used_teardrop && used_glowberry) { addtoinv(6); used_carrot=used_teardrop=used_glowberry=false; }
    }
    dragging4 = -1;
  }
}
