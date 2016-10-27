angular.module('rpgApp',[])
  .controller('RpgCtrl',function($scope, $interval, $timeout){

  	var rpg = $scope;

    var expTotal = 0, crowneTotal = 0;
    var currentMapIndex = 0, stageCounter = 0;

    //FRONT PAGE + WORLDMAP + MAP
    rpg.frontPage = true;
    rpg.worldMapStages=false;
    rpg.userName = '';

    rpg.startGame =  function(){
      if(rpg.userName){
        rpg.mapShow = true;
        //rpg.worldMapShow=true;
        rpg.worldMapStages=true;
        rpg.userInfoIconShow=true;
        rpg.frontPage = false;
      }else{
        rpg.userNameShow = true;
      }
    }

    rpg.userNameSubmit=function(){
      if(rpg.userName.length>8){
        rpg.userNameLongShow=true;
        rpg.userNameNoShow = false;
      }
      else if (!rpg.userName){
        rpg.userNameNoShow = true;
        rpg.userNameLongShow=false;
      }
      else{
        rpg.userNameShow = false;
        rpg.mapShow = true;
        rpg.worldMapShow=true;
        rpg.userInfoIconShow=true;
        rpg.worldMapStages=true;
        rpg.frontPage=false;
        rpg.userName=rpg.userName.toUpperCase();
      }
    }

    //USERINFO
    rpg.userInfoIconShow = false;
    rpg.userInfoOptions = false;
    rpg.userInfoStatus = false;
    rpg.userInfoSkills = false;
    rpg.userInfoItems = false;
    rpg.userInfoEquipments = false;
    //rpg.userInfoIconShow=true;

    rpg.choosenClass = 'rogue';

    //SHOP
    rpg.shopShow = false;
    rpg.shopFrontShow = true;
    rpg.shopBuyShow = false;
    rpg.shopSellShow = false;

    //ACTION
    rpg.actionShow = false;
  	rpg.userShow =true;
  	rpg.userWaitShow = false;
  	rpg.itemShow = false;
  	rpg.skillShow = false;
  	rpg.winShow = false;
  	rpg.loseShow = false;
    rpg.userStart = false;
    rpg.runSuccessShow = false;
    rpg.runFailureShow = false;

    /*************************
    JSON
    *************************/
    //maps & stages

    rpg.mapFull = [{'index': 1, 'unlocked': true},
            {'index': 2, 'unlocked': false},
            {'index': 3, 'unlocked': false},
            {'index': 4, 'unlocked': false},
            {'index': 5, 'unlocked': false},
            {'index': 6, 'unlocked': false},
            {'index': 7, 'unlocked': false},
            {'index': 8, 'unlocked': false},
            {'index': 9, 'unlocked': false},
            {'index': 10, 'unlocked': false},
            {'index': 11, 'unlocked': false},
            {'index': 12, 'unlocked': false},
            {'index': 13, 'unlocked': false},
            {'index': 14, 'unlocked': false},
            {'index': 15, 'unlocked': false},
            {'index': 16, 'unlocked': false},
            {'index': 17, 'unlocked': false},
            {'index': 18, 'unlocked': false},
            {'index': 19, 'unlocked': false},
            {'index': 20, 'unlocked': false},
            {'index': 21, 'unlocked': false},
            {'index': 22, 'unlocked': false},
            {'index': 23, 'unlocked': false},
            {'index': 24, 'unlocked': false},
            {'index': 25, 'unlocked': false},
            {'index': 26, 'unlocked': false},
            {'index': 27, 'unlocked': false},
            {'index': 28, 'unlocked': false},
            {'index': 29, 'unlocked': false},
            {'index': 30, 'unlocked': false},
            {'index': 31, 'unlocked': false},
            {'index': 32, 'unlocked': false},
            {'index': 33, 'unlocked': false},
            {'index': 34, 'unlocked': false},
            {'index': 35, 'unlocked': false},
            {'index': 36, 'unlocked': false},
          ];

    // USER

    rpg.user = {'maxHp' : 200, 'maxMp' : 100, 'hp': 200, 'mp' : 100,
                'str' : 10, 'def' : 10, 'int' : 10, 'speed': 10,
                'damage' : 15, 'magicDamage' : 18, 'coolDown' : 2000,
                'crowne': 100, 'level': 1, 'exp': 0,'maxExp': 10,
                'statPoints': 5, 'skillPoints':2};
    //ITEM

    rpg.items = [{'index':1, 'name' : 'Red potion', 'num' : 1, 'fn': 'redPotion(item)','hp': 50,'mp': 0, 'category': 'consumables','price': 10,'shortDescription': 'Heal 20 hp'}];

    rpg.itemUse = function(item){
      if(item.num === 0){}
      else{
        item.num--;
        rpg.user.hp += item.hp;
        rpg.user.mp += item.mp;
        if(rpg.user.hp>rpg.user.maxHp){rpg.user.hp=rpg.user.maxHp;}
        if(rpg.user.mp>rpg.user.maxMp){rpg.user.mp=rpg.user.maxMp;}
      }
    }

    rpg.userItemCancel = function(){
      rpg.itemShow = false;
      rpg.items = rpg.items.filter(function(el){if(el.num!==0){return el;}});
      rpg.userShow = true;
    }

    //SKILL

    rpg.skills = [];

    // INITIATE SHOW DAMAGE (?) [DON'T KNOW WHY LOL]
    rpg.enemies = [{'name' : 'Slinky Slime', 'maxHp' : 550, 'maxMp' : 200, 'hp' : 550, 'mp' : 200, 'click' : true , 'damage' : 2, 'time' : 1000, 'index' : 1, 'exp' : 3, 'crowne': 5},
                  {'name' : 'Pipping Potato', 'maxHp' : 400, 'maxMp' : 300, 'hp' : 400, 'mp' : 300, 'click' : false, 'damage' : 1, 'time' : 2000, 'index' : 2, 'exp' : 3, 'crowne': 5},
                  {'name' : 'Bubu Bear', 'maxHp' : 200, 'maxMp' : 100, 'hp' : 200, 'mp' : 100, 'click' : false, 'damage' : 5, 'time' : 8000, 'index': 3, 'exp' : 3, 'crowne': 5}
                ];

    // INITIATE SHOP
    rpg.shop = [{'name': 'Red potion', 'price': '10', 'selected' : true,'fn': 'redPotion(item)', 'shortDescription': 'Heal 20 hp','description' : 'Red potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                {'name': 'Blue potion', 'price': '10', 'selected' : false, 'fn': 'bluePotion(item)', 'shortDescription': 'Heal 20 mp','description' : 'Blue potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                {'name': 'Green potion', 'price': '10', 'selected' : false, 'fn': 'greenPotion(item)', 'shortDescription': 'Heal 50 hp','description' : 'Green potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
              ];

//-----------------------------------------------------------------------------------------//
    var enemyOneTurn, enemyTwoTurn, enemyThreeTurn;
    var userTurn;
    var winEnemy1=0, winEnemy2=0, winEnemy3=0;
    var stage1Filter = [], mapFilter = [], latestMap = 0;
    var mapLatestFilter = 0;

    var totalEnemyHp = 10;

    var attack = true;
    function userTurnFn(selectedEn){

      var enemiesLeft = rpg.enemies.filter(function(el){if(el.hp > 0){return el;}});
      if( selectedEn[0].hp < rpg.user.damage && enemiesLeft.length === 0){
        rpg.userShow = false;
        rpg.skillShow = false;
      }
      else{
        rpg.userShow = false;
        rpg.skillShow = false;
        rpg.userWaitShow = true;
        //end the cool down
        if(selectedEn[0].hp + rpg.user.damage > rpg.user.damage && attack){selectedEn[0].strike=true;}
        else{
          selectedEn[0].click=false;
          if(rpg.enemies.length===2){
            if(selectedEn[0].hp <= 0){
              if(selectedEn[0].index===1){rpg.enemies[1].click=true;}else if(selectedEn[0].index===2){rpg.enemies[0].click=true;}
            }
          }
          if(rpg.enemies.length===3){
            if(selectedEn[0].hp <= 0){
              if(selectedEn[0].index===1){if(rpg.enemies[1].hp>0){rpg.enemies[1].click=true;}else{rpg.enemies[2].click=true;}}
              else if(selectedEn[0].index===2){if(rpg.enemies[2].hp>0){rpg.enemies[2].click=true;}else{rpg.enemies[0].click=true;}}
              else if(selectedEn[0].index===3){if(rpg.enemies[0].hp>0){rpg.enemies[0].click=true;}else{rpg.enemies[1].click=true;}}
            }
          }
        }

        userTurn = $timeout(function(){
          rpg.userShow = true;

          rpg.userWaitShow = false; selectedEn[0].strike=false;attack=true;},rpg.user.coolDown);

        if(rpg.user.hp <= 0){
          rpg.user.hp = 0;
          rpg.userShow = false;
          rpg.itemShow = false;
          rpg.skillShow = false;
          rpg.userShow = false;
          rpg.userWaitShow = false;
          rpg.loseShow = true;
          $timeout.cancel(userTurn);
          $interval.cancel(enemyOneTurn);
          $interval.cancel(enemyTwoTurn);
          $interval.cancel(enemyThreeTurn);
          $interval.cancel(poisonDamage1);
          $interval.cancel(poisonDamage2);
          $interval.cancel(poisonDamage3);
          $interval.cancel(flameHookDamage1);
          $interval.cancel(flameHookDamage1);
          $interval.cancel(flameHookDamage1);
       }
      }
    }

    rpg.enemiesDatabase= [
      {'name' : 'M1', 'maxHp' : 50, 'maxMp' : 50, 'hp' : 50, 'mp' : 50, 'def': 1, 'click' : false, 'damage' : 10, 'time' : 5000, 'index' : 1, 'exp' : 3, 'crowne': 5},
      {'name' : 'M25', 'maxHp' : 80, 'maxMp' : 30, 'hp' : 80, 'mp' : 30, 'def': 5, 'click' : false , 'damage' : 15, 'time' : 4000, 'index' : 1, 'exp' : 5, 'crowne': 10},
      {'name' : 'M2', 'maxHp' : 60, 'maxMp' : 20, 'hp' : 60, 'mp' : 20, 'def': 10, 'click' : false, 'damage' : 20, 'time' : 6000, 'index' : 1, 'exp' : 10, 'crowne': 5},
      {'name' : 'M3', 'maxHp' : 100, 'maxMp' : 100, 'hp' : 100, 'mp' : 100, 'def': 15, 'click' : false, 'damage' : 25, 'time' : 4000, 'index': 1, 'exp' : 12, 'crowne': 10},
      {'name' : 'M26', 'maxHp' : 150, 'maxMp' : 80, 'hp' : 150, 'mp' : 80, 'def': 15, 'click' : false, 'damage' : 40, 'time' : 4500, 'index': 1, 'exp' : 15, 'crowne': 15},
      {'name' : 'M27', 'maxHp' : 125, 'maxMp' : 50, 'hp' : 125, 'mp' : 60, 'def': 30, 'click' : false, 'damage' : 30, 'time' : 6500, 'index': 1, 'exp' : 18, 'crowne': 20},
      {'name' : 'M4', 'maxHp' : 150, 'maxMp' : 100, 'hp' : 150, 'mp' : 100, 'def': 20, 'click' : false, 'damage' : 45, 'time' : 3000, 'index' : 1, 'exp' : 25, 'crowne': 25},
      {'name' : 'M5', 'maxHp' : 200, 'maxMp' : 200, 'hp' : 200, 'mp' : 200, 'def': 25, 'click' : false, 'damage' : 30, 'time' : 5000, 'index' : 1, 'exp' : 20, 'crowne': 25},
      {'name' : 'M6', 'maxHp' : 230, 'maxMp' : 80, 'hp' : 230, 'mp' : 80, 'def': 20, 'click' : false, 'damage' : 35, 'time' : 4000, 'index': 1, 'exp' : 30, 'crowne': 35},
      {'name' : 'M7', 'maxHp' : 550, 'maxMp' : 500, 'hp' : 550, 'mp' : 500, 'def': 50, 'click' : false , 'damage' : 40, 'time' : 5000, 'index' : 1, 'exp' : 50, 'crowne': 50}
  ];

  rpg.enemies2Database = [
      {'name' : 'M8', 'maxHp' : 150, 'maxMp' : 100, 'hp' : 150, 'mp' : 100, 'def': 20, 'click' : false, 'damage' : 30, 'time' : 3500, 'index' : 1, 'exp' : 25, 'crowne': 25},
      {'name' : 'M9', 'maxHp' : 180, 'maxMp' : 120, 'hp' : 180, 'mp' : 120, 'def': 25, 'click' : false, 'damage' : 35, 'time' : 5000, 'index' : 1, 'exp' : 30, 'crowne': 25},
      {'name' : 'M28', 'maxHp' : 200, 'maxMp' : 130, 'hp' : 200, 'mp' : 130, 'def': 30, 'click' : false, 'damage' : 40, 'time' : 6000, 'index' : 1, 'exp' : 35, 'crowne': 40},
      {'name' : 'M10', 'maxHp' : 250, 'maxMp' : 120, 'hp' : 250, 'mp' : 120, 'def': 25, 'click' : false, 'damage' : 45, 'time' : 4000, 'index' : 1, 'exp' : 45, 'crowne': 20},
      {'name' : 'M29', 'maxHp' : 230, 'maxMp' : 50, 'hp' : 230, 'mp' : 50, 'def': 40, 'click' : false, 'damage' : 50, 'time' : 5500, 'index' : 1, 'exp' : 40, 'crowne': 45},
      {'name' : 'M11', 'maxHp' : 280, 'maxMp' : 180, 'hp' : 280, 'mp' : 180, 'def': 30, 'click' : false, 'damage' : 55, 'time' : 4000, 'index' : 1, 'exp' : 45, 'crowne': 40},
      {'name' : 'M12', 'maxHp' : 320, 'maxMp' : 100, 'hp' : 320, 'mp' : 100, 'def': 35, 'click' : false, 'damage' : 50, 'time' : 4500, 'index' : 1, 'exp' : 50, 'crowne': 50},
      {'name' : 'M13', 'maxHp' : 350, 'maxMp' : 300, 'hp' : 350, 'mp' : 300, 'def': 45, 'click' : false, 'damage' : 80, 'time' : 6000, 'index' : 1, 'exp' : 55, 'crowne': 55},
      {'name' : 'M14', 'maxHp' : 380, 'maxMp' : 240, 'hp' : 380, 'mp' : 240, 'def': 40, 'click' : false, 'damage' : 70, 'time' : 4800, 'index' : 1, 'exp' : 60, 'crowne': 80},
      {'name' : 'M15', 'maxHp' : 1300, 'maxMp' : 1000, 'hp' : 1300, 'mp' : 1000, 'def': 65, 'click' : false, 'damage' : 120, 'time' : 4500, 'index' : 1, 'exp' : 100, 'crowne': 100},
  ];

  rpg.enemies3Database = [
      {'name' : 'M16', 'maxHp' : 400, 'maxMp' : 300, 'hp' : 400, 'mp' : 300, 'def': 40, 'click' : false, 'damage' : 80, 'time' : 4500, 'index' : 1, 'exp' : 65, 'crowne': 95},
      {'name' : 'M30', 'maxHp' : 440, 'maxMp' : 220, 'hp' : 440, 'mp' : 220, 'def': 45, 'click' : false, 'damage' : 95, 'time' : 3000, 'index' : 1, 'exp' : 90, 'crowne': 105},
      {'name' : 'M17', 'maxHp' : 490, 'maxMp' : 330, 'hp' : 490, 'mp' : 330, 'def': 50, 'click' : false, 'damage' : 105, 'time' : 5000, 'index' : 1, 'exp' : 105, 'crowne': 110},
      {'name' : 'M18', 'maxHp' : 510, 'maxMp' : 420, 'hp' : 510, 'mp' : 420, 'def': 55, 'click' : false, 'damage' : 125, 'time' : 3500, 'index' : 1, 'exp' : 115, 'crowne': 120},
      {'name' : 'M19', 'maxHp' : 550, 'maxMp' : 550, 'hp' : 550, 'mp' : 550, 'def': 45, 'click' : false, 'damage' : 170, 'time' : 3500, 'index' : 1, 'exp' : 125, 'crowne': 145},
      {'name' : 'M20', 'maxHp' : 480, 'maxMp' : 180, 'hp' : 480, 'mp' : 180, 'def': 30, 'click' : false, 'damage' : 180, 'time' : 2500, 'index' : 1, 'exp' : 140, 'crowne': 190},
      {'name' : 'M21', 'maxHp' : 600, 'maxMp' : 190, 'hp' : 600, 'mp' : 190, 'def': 65, 'click' : false, 'damage' : 200, 'time' : 5500, 'index' : 1, 'exp' : 150, 'crowne': 210},
      {'name' : 'M22', 'maxHp' : 660, 'maxMp' : 270, 'hp' : 660, 'mp' : 270, 'def': 60, 'click' : false, 'damage' : 230, 'time' : 4500, 'index' : 1, 'exp' : 155, 'crowne': 255},
      {'name' : 'M23', 'maxHp' : 780, 'maxMp' : 640, 'hp' : 780, 'mp' : 640, 'def': 80, 'click' : false, 'damage' : 70, 'time' : 3000, 'index' : 1, 'exp' : 200, 'crowne': 280},
      {'name' : 'M24', 'maxHp' : 1800, 'maxMp' : 1500, 'hp' : 1800, 'mp' : 1500, 'def': 70, 'click' : false, 'damage' : 350, 'time' : 3500, 'index' : 1, 'exp' : 500, 'crowne': 500},
  ];

    function enemiesMap(){
      if(stageCounter===1){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[0])];
      } else if(stageCounter===2){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[0]), Object.create(rpg.enemiesDatabase[1])];
      } else if(stageCounter===3){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[0]), Object.create(rpg.enemiesDatabase[2])];
      } else if(stageCounter===4){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[0]),  Object.create(rpg.enemiesDatabase[2]), Object.create(rpg.enemiesDatabase[1])];
      }else if(stageCounter===5){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[3]), Object.create(rpg.enemiesDatabase[4])];
      } else if(stageCounter===6){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[3]),  Object.create(rpg.enemiesDatabase[1]), Object.create(rpg.enemiesDatabase[2])];
      } else if(stageCounter===7){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[4]),  Object.create(rpg.enemiesDatabase[5])];
      } else if(stageCounter===8){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[6],  Object.create(rpg.enemiesDatabase[7]))];
      } else if(stageCounter===9){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[7]), Object.create(rpg.enemiesDatabase[8])];
      } else if(stageCounter===10){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[8]), Object.create(rpg.enemiesDatabase[6]), Object.create(rpg.enemiesDatabase[5]) ];
      } else if(stageCounter===11){
        rpg.enemies = [Object.create(rpg.enemiesDatabase[9])];
      } else if(stageCounter===12){
        rpg.enemies = [Object.create(rpg.enemies2Database[0]),Object.create(rpg.enemies2Database[1])];
      } else if(stageCounter===13){
        rpg.enemies = [Object.create(rpg.enemies2Database[1]), Object.create(rpg.enemies2Database[1])];
      } else if(stageCounter===14){
        rpg.enemies = [Object.create(rpg.enemies2Database[2]), Object.create(rpg.enemies2Database[3])];
      } else if(stageCounter===15){
        rpg.enemies = [Object.create(rpg.enemies2Database[1]), Object.create(rpg.enemies2Database[2]), Object.create(rpg.enemies2Database[3])];
      }else if(stageCounter===16){
        rpg.enemies = [Object.create(rpg.enemies2Database[3]), Object.create(rpg.enemies2Database[3]), Object.create(rpg.enemies2Database[4])];
      }else if(stageCounter===17){
        rpg.enemies = [Object.create(rpg.enemies2Database[4]), Object.create(rpg.enemies2Database[5])];
      } else if(stageCounter===18){
        rpg.enemies = [Object.create(rpg.enemies2Database[6]), Object.create(rpg.enemies2Database[7]), Object.create(rpg.enemies2Database[5])];
      } else if(stageCounter===19){
        rpg.enemies = [Object.create(rpg.enemies2Database[6]), Object.create(rpg.enemies2Database[6]), Object.create(rpg.enemies2Database[2])];
      } else if(stageCounter===20){
        rpg.enemies = [Object.create(rpg.enemies2Database[7]), Object.create(rpg.enemies2Database[8])];
      }else if(stageCounter===21){
        rpg.enemies = [Object.create(rpg.enemies2Database[8]), Object.create(rpg.enemies2Database[8]), Object.create(rpg.enemies2Database[8])];
      }else if(stageCounter===22){
        rpg.enemies = [Object.create(rpg.enemies2Database[9])];
      }else if(stageCounter===23){
        rpg.enemies = [Object.create(rpg.enemies3Database[0]),Object.create(rpg.enemies3Database[1]), Object.create(rpg.enemies3Database[2])];
      } else if(stageCounter===24){
        rpg.enemies = [Object.create(rpg.enemies3Database[0]), Object.create(rpg.enemies3Database[2])];
      } else if(stageCounter===25){
        rpg.enemies = [Object.create(rpg.enemies3Database[5])];
      } else if(stageCounter===26){
        rpg.enemies = [Object.create(rpg.enemies3Database[1]), Object.create(rpg.enemies3Database[2]), Object.create(rpg.enemies3Database[3])];
      }else if(stageCounter===27){
        rpg.enemies = [Object.create(rpg.enemies3Database[2]), Object.create(rpg.enemies3Database[4]), Object.create(rpg.enemies3Database[1])];
      }else if(stageCounter===28){
        rpg.enemies = [Object.create(rpg.enemies3Database[4]), Object.create(rpg.enemies3Database[5]), Object.create(rpg.enemies3Database[4])];
      } else if(stageCounter===29){
        rpg.enemies = [Object.create(rpg.enemies3Database[5]), Object.create(rpg.enemies3Database[6])];
      } else if(stageCounter===30){
        rpg.enemies = [Object.create(rpg.enemies3Database[5]), Object.create(rpg.enemies3Database[7])];
      } else if(stageCounter==31){
        rpg.enemies = [Object.create(rpg.enemies3Database[6]), Object.create(rpg.enemies3Database[5]), Object.create(rpg.enemies3Database[6])];
      }else if(stageCounter===32){
        rpg.enemies = [Object.create(rpg.enemies3Database[7]), Object.create(rpg.enemies3Database[8]), Object.create(rpg.enemies3Database[3])];
      }else if(stageCounter===33){
        rpg.enemies = [Object.create(rpg.enemies3Database[9])];
      }
      rpg.enemies[0].click=true; for(var i=0; i<rpg.enemies.length;i++){rpg.enemies[i].index = i+1;}
    }

    function enemyOneAttack(){
      rpg.enemies[0].damageUser = Math.floor(rpg.enemies[0].damage*((100-rpg.user.def)/100));
      rpg.user.hp -=rpg.enemies[0].damageUser;
      rpg.damageShow1 = true;
      rpg.enemies[0].attack = true;
      $timeout(function(){rpg.damageShow1=false; rpg.enemies[0].attack = false;},1500);
      userLose();
    }

    function enemyTwoAttack(){
      rpg.enemies[1].damageUser = Math.floor(rpg.enemies[1].damage*((100-rpg.user.def)/100));
      rpg.user.hp -=rpg.enemies[1].damageUser;
      rpg.damageShow2 = true;
      rpg.enemies[1].attack = true;
      $timeout(function(){rpg.damageShow2=false; rpg.enemies[1].attack = false;},1500);
      //$timeout(function(){rpg.damageShow2=false;},1500);
      userLose();
    }

    function enemyThreeAttack(){
      rpg.enemies[2].damageUser = Math.floor(rpg.enemies[2].damage*((100-rpg.user.def)/100));
      rpg.user.hp -=rpg.enemies[2].damageUser;
      rpg.damageShow3 = true;
      rpg.enemies[2].attack = true;
      $timeout(function(){rpg.damageShow3=false; rpg.enemies[2].attack = false;},1500);
      userLose();
    }

    function enemyTurn(){
      enemyOneTurn = $interval(function(){enemyOneAttack();}, rpg.enemies[0].time);
      if(rpg.enemies.length >= 2){enemyTwoTurn = $interval(function(){enemyTwoAttack();}, rpg.enemies[1].time);}
      if(rpg.enemies.length === 3){enemyThreeTurn = $interval(function(){enemyThreeAttack();}, rpg.enemies[2].time);}
    }

    function userWin(){
        if(rpg.enemies[0].hp<=0){
          rpg.enemies[0].hp = 0;
          $interval.cancel(enemyOneTurn);
          winEnemy1 = 1;
        }
        if(rpg.enemies.length >= 2){
          if(rpg.enemies[1].hp<=0){
            rpg.enemies[1].hp = 0;
            $interval.cancel(enemyTwoTurn);
            winEnemy2=1;
          }
        }
        if(rpg.enemies.length === 3){
          if(rpg.enemies[2].hp<=0){
            rpg.enemies[2].hp = 0;
            $interval.cancel(enemyThreeTurn);
            winEnemy3=1;
          }
        }
        if((winEnemy1 + winEnemy2 + winEnemy3) === rpg.enemies.length){
          rpg.userShow = false;
          rpg.winShow = true;
          rpg.userWaitShow = false; attack=true;

          $timeout.cancel(userTurn);
          $interval.cancel(poisonDamage1);
          $interval.cancel(poisonDamage2);
          $interval.cancel(poisonDamage3);
          $interval.cancel(flameHookDamage1);
          $interval.cancel(flameHookDamage1);
          $interval.cancel(flameHookDamage1);
          reward();
        }
      }
      var poisonDamage1, poisonDamage2, poisonDamage3, flameHookDamage1, flameHookDamage2, flameHookDamage3 ;
      function userLose(){
        if(rpg.user.hp <= 0){
          rpg.user.hp = 0;
          rpg.userShow = false;
          rpg.itemShow = false;
          rpg.skillShow = false;
        	rpg.userWaitShow =false;
          rpg.loseShow = true;
          rpg.runFailureShow = false;
          $timeout.cancel(userTurn);
          $interval.cancel(enemyOneTurn);
          $interval.cancel(enemyTwoTurn);
          $interval.cancel(enemyThreeTurn);
          $interval.cancel(poisonDamage1);
          $interval.cancel(poisonDamage2);
          $interval.cancel(poisonDamage3);
          $interval.cancel(flameHookDamage1);
          $interval.cancel(flameHookDamage1);
          $interval.cancel(flameHookDamage1);
       }
     }

     var levelUpCounter = false;
     function reward(){
       if(rpg.enemies.length===1){expTotal = rpg.enemies[0].exp;}
       else if(rpg.enemies.length===2){expTotal = rpg.enemies[0].exp + rpg.enemies[1].exp;}
       else if(rpg.enemies.length===3){expTotal = rpg.enemies[0].exp + rpg.enemies[1].exp + rpg.enemies[2].exp;}

       if(rpg.enemies.length===1){crowneTotal = rpg.enemies[0].crowne;}
       else if(rpg.enemies.length===2){crowneTotal = rpg.enemies[0].crowne + rpg.enemies[1].crowne;}
       else if(rpg.enemies.length===3){crowneTotal = rpg.enemies[0].crowne + rpg.enemies[1].crowne + rpg.enemies[2].crowne;}

       rpg.user.exp += Math.floor(expTotal);
       rpg.user.crowne += Math.floor(crowneTotal);
       rpg.rewardExp = Math.floor(expTotal);
       rpg.rewardCrowne = Math.floor(crowneTotal);
       while(rpg.user.exp >= rpg.user.maxExp){
         rpg.user.hp = rpg.user.maxHp;
         rpg.user.mp = rpg.user.maxMp;
         rpg.user.level++;
         rpg.user.statPoints+= 5;
         rpg.user.skillPoints+=1;
         rpg.user.exp = rpg.user.exp-rpg.user.maxExp;
         rpg.user.maxExp = Math.floor(rpg.user.maxExp*2.5);
         levelUpCounter = true;
       }
     }

/*----------------------------------------------------------------------------------------------------------------*/
    //enter map
    rpg.enter = function(map){
        rpg.currentMap = map.index;
        rpg.try =0;
        rpg.userInfoOptions=false;
      if(map.unlocked){
        map.show = true;
        rpg.worldMapShow = false;
      }
    }

    //enter userInfoStatus
    rpg.userStatusHpLevelUp= function(){
      rpg.user.statPoints--; rpg.user.maxHp += 20; rpg.user.hp+=20;
    }
    rpg.userStatusMpLevelUp= function(){
      rpg.user.statPoints--;rpg.user.maxMp += 20; rpg.user.mp+=20;
    }
    rpg.userStatusStrLevelUp= function(){
      rpg.user.statPoints--;rpg.user.str += 1;
      rpg.user.damage = Math.floor(rpg.user.str*1.5);
    }
    rpg.userStatusDefLevelUp= function(){
      rpg.user.statPoints--;rpg.user.def += 1;
    }
    rpg.userStatusIntLevelUp= function(){
      rpg.user.statPoints--;rpg.user.int += 1;
      rpg.user.magicDamage = Math.floor(rpg.user.int*1.8);
    }
    rpg.userStatusSpeedLevelUp= function(){
      rpg.user.statPoints--;rpg.user.speed += 1;
      rpg.user.coolDown -= 50;
    }

    //enter userInfoSkills
    rpg.skillsDatabase = [
                          {'index': 1, 'name' : 'Swift stab', 'mpCost' : '20', 'level' : 0, 'damage' : 150 ,'fn' : 'dirtyStab(skill)',  'class': 'rogue', 'unlocked': true, 'checked': true, 'description' : ['Level 1: deals 1.3x damage', 'Level 2: deals 1.6x damage', 'Level 3: deals 2x damage','Level 4: deals 2.3x damage','Level 5: deals 2.6x damage',]},
                          {'index': 2, 'name' : 'Back stab', 'mpCost' : '10', 'level' : 0, 'damage' : 50,'fn' : 'backStab(skill)',  'class': 'rogue', 'unlocked': false, 'checked': true, 'prerequisite' : 'swift stab level 3', 'description' : ['level 1: reduces 10% enemy def', 'level 2: reduces 20% enemy def','level 3: reduces 30% enemy def','level 4: reduces 40% enemy def','level 5: reduces 50% enemy def']},
                          {'index': 3, 'name' : 'Speed down', 'mpCost' : '10', 'level' : 0, 'damage' : 50, 'fn' : 'speedDown(skill)',  'class': 'rogue', 'unlocked': false, 'checked': true, 'prerequisite' : 'swift stab level 3', 'description' : ['level 1: increases enemy cool down by 0.5s', 'level 2: increases enemy cool down by 1s','level 3: increases enemy cool down by 1.5s','level 4: increases enemy cool down by 2s','level 5: increases enemy cool down by 2.5s']},
                          {'index': 4, 'name' : 'Attack down', 'mpCost' : '10', 'level' : 0, 'damage' : 50 ,'fn' : 'attackDown(skill)',  'class': 'rogue', 'unlocked': false, 'checked': true, 'prerequisite' : 'swift stab level 3', 'description' : ['level 1: reduces 10% enemy damage', 'level 2: reduces 20% enemy damage','level 3: reduces 30% enemy damage','level 4: reduces 40% enemy damage', 'level 5: reduces 50% enemy damage']},
                          {'index': 5, 'name' : 'Poison', 'mpCost' : '15', 'level' : 0, 'damage' : 10,'fn' : 'poison(skill)',  'class': 'rogue', 'unlocked': true, 'checked': true, 'description' : ['level 1: deals 5 damage per second for 5 seconds', 'level 2: deals 10 damage per second for 5 seconds','level 3: deals 15 damage per second for 5 seconds','level 4: deals 20 damage per second for 5 seconds','level 5: deals 25 damage per second for 5 seconds']},
                          {'index': 6, 'name' : 'Game cheat', 'mpCost' : '20', 'level' : 0, 'damage' : 9999, 'fn' : 'gameCheat(skill)',  'class': 'rogue','prerequisite' : '???', 'description' : 'deals 9999 damage'},
                          {'index': 7, 'name' : 'Hit', 'mpCost' : '10', 'level' : 0, 'damage' : 100 ,'fn' : 'hit(skill)', 'class': 'knight', 'unlocked': true, 'checked': true, 'description' : ['level 1: deals 1.25x damage', 'level 2: deals 1.5x damage','level 3: deals 1.75x damage','level 4: deals 2x damage','level 5: deals 2.25x damage']},
                          {'index': 8, 'name' : 'Harder hit', 'mpCost' : '20', 'level' : 0, 'damage' : 200,'fn' : 'harderHit(skill)', 'class': 'knight', 'unlocked': false, 'checked': true, 'prerequisite' : 'hit level 5', 'description' : ['level 1: deals 1.3x damage', 'level 2: deals 1.6x damage','level 3: deals 2x damage','level 4: deals 2.3x damage','level 5: deals 2.6x damage']},
                          {'index': 9, 'name' : 'Hardest hit', 'mpCost' : '30', 'level' : 0, 'damage' : 300, 'fn' : 'hardestHit(skill)', 'class': 'knight', 'unlocked': false, 'checked': true, 'prerequisite' : 'harder hit level 5', 'description' : ['level 1: deals 1.6x damage', 'level 2: deals 2.2x damage','level 3: deals 2.9x damage','level 4: deals 3.5x damage','level 5: deals 4x damage']},
                          {'index': 10, 'name' : 'Defense up', 'mpCost' : '10', 'level' : 0, 'damage' : 50, 'fn' : 'defenseUp(skill)', 'class': 'knight', 'unlocked': false, 'checked': true, 'prerequisite' : 'hit level 5', 'description' : ['level 1: inceases 10% def for 10 seconds', 'level 2: inceases 20% def for 10 seconds','level 3: inceases 30% def for 10 seconds','level 4: inceases 40% def for 10 seconds','level 5: inceases 50% def for 10 seconds']},
                          {'index': 11, 'name' : 'Attack up', 'mpCost' : '10', 'level' : 0, 'damage' : 50 ,'fn' : 'attackUp(skill)', 'class': 'knight', 'unlocked': false, 'checked': true, 'prerequisite' : 'hit level 5', 'description' : ['level 1: increases 20 damage for 10 seconds', 'level 2: increases 40 damage for 10 seconds','level 3: increases 60 damage for 10 seconds','level 4: increases 80 damage for 10 seconds','level 5: increases 100 damage for 10 seconds']},
                          {'index': 12, 'name' : 'Speed up', 'mpCost' : '10', 'level' : 0, 'damage' : 50,'fn' : 'speedUp(skill)', 'class': 'knight', 'unlocked': false, 'checked': true, 'prerequisite' : 'hit level 5', 'description' : ['level 1: decreases 0.2 seconds of cool down for 10 seconds', 'level 2: decreases 0.4 seconds of cool down for 10 seconds','level 3: decreases 0.6 seconds of cool down for 10 seconds','level 4: decreases 0.8 seconds of cool down for 10 seconds','level 5: decreases 1 second of cool down for 10 seconds']},
                          {'index': 13, 'name' : 'Fire arrow', 'mpCost' : '20', 'level' : 0, 'damage' : 50 ,'fn' : 'fireArrow(skill)', 'class': 'magician', 'unlocked': true, 'checked': true, 'description' : ['level 1: deals 1.25x magic damage', 'level 2: deals 1.5x magic damage','level 3: deals 1.75x magic damage','level 4: deals 2x magic damage','level 5: deals 2.25x magic damage']},
                          {'index': 14, 'name' : 'Flame hook', 'mpCost' : '25', 'level' : 0, 'damage' : 50,'fn' : 'flameHook(skill)', 'class': 'magician', 'unlocked': false, 'checked': true, 'prerequisite' : 'fire arrow level 5', 'description' : ['level 1: deals 0.2x magic damage per second for 5 seconds', 'level 2: deals 0.4x magic damage per second for 5 seconds','level 3: deals 1.6x magic damage per second for 5 seconds','level 4: deals 1.8x magic damage per seconds for 5 seconds','level 5: deals 2x magic damage per seconds for 5 seconds']},
                          {'index': 15, 'name' : 'Ice spear', 'mpCost' : '20', 'level' : 0, 'damage' : 50, 'fn' : 'iceSpear(skill)',  'class': 'magician', 'unlocked': true, 'checked': true, 'description' : ['level 1: deals 1.25x magic damage', 'level 2: deals 1.5x magic damage','level 3: deals 1.75x magic damage','level 4: deals 2x magic damage','level 5: deals 2.25x magic damage']},
                          {'index': 16, 'name' : 'Iceberg freeze', 'mpCost' : '25', 'level' : 0, 'damage' : 50 ,'fn' : 'icebergFreeze(skill)',  'class': 'magician', 'unlocked': false, 'checked': true, 'prerequisite' : 'ice arrow level 5', 'description' : ['level 1: stops enemies for 1.5 seconds', 'level 2: stops enemies for 2.5 seconds', 'level 3: stops enemies for 3.5 seconds', 'level 4: stops enemies for 1.5 seconds', 'level 5: stops enemies for 5.5 seconds']},
                          {'index': 17, 'name' : 'Lightning bolt', 'mpCost' : '20', 'level' : 0, 'damage' : 50,'fn' : 'lightningBolt(skill)',  'class': 'magician', 'unlocked': true, 'checked': true, 'description' : ['level 1: deals 1.25x magic damage', 'level 2: deals 1.5x magic damage','level 3: deals 1.75x magic damage','level 4: deals 2x magic damage','level 5: deals 2.25x magic damage']},
                          {'index': 18, 'name' : 'Spark blitz', 'mpCost' : '40', 'level' : 0, 'damage' : 50, 'fn' : 'sparkBlitz(skill)',  'class': 'magician', 'unlocked': false,  'checked': true, 'prerequisite' : 'lightning bolt level 5', 'description' : ['level 1: deals 1.5x magic damage', 'level 2: deals 2x magic damage','level 3: deals 2.5x magic damage','level 4: deals 3x magic damage','level 5: deals 3.5x magic damage']}
                        ];

    for(var i=0; i<rpg.skillsDatabase.length; i++){
      rpg.skillsDatabase[i].complete=false;
    }

    rpg.enterSkills = function(){
      rpg.userInfoSkills = true;
      rpg.userInfoOptions=false;
      for(var i=0; i<rpg.skillsDatabase.length; i++){rpg.skillsDatabase[i].selected = false;}
      rpg.skillsDatabase[0].selected = true;

      userSkillSelected = rpg.skillsDatabase.filter(function(el){return el.selected});
      rpg.userSkillSelectedDescription = userSkillSelected[0].description;
      rpg.userSkillSelectedMp = userSkillSelected[0].mpCost;
      rpg.userSkillSelectedPrerequisite = userSkillSelected[0].prerequisite;
      rpg.userSkillSelectedUnlocked = userSkillSelected[0].unlocked;
    }
    rpg.userSkillLevelUp = function(skillsDatabase, skill){
      if(rpg.user.skillPoints>0){skill.level++; rpg.user.skillPoints--;}
      //rogue
      if(rpg.skillsDatabase[0].level>=3){rpg.skillsDatabase[1].unlocked=true; rpg.skillsDatabase[2].unlocked=true;rpg.skillsDatabase[3].unlocked=true;}
      if(rpg.skillsDatabase[0].level>=10){rpg.skillsDatabase[5].unlocked=true;}
      //knight
      if(rpg.skillsDatabase[6].level>=3){rpg.skillsDatabase[7].unlocked=true;}
      if(rpg.skillsDatabase[7].level>=3){rpg.skillsDatabase[8].unlocked=true;}
      if(rpg.skillsDatabase[6].level>=3){rpg.skillsDatabase[9].unlocked=true;}
      if(rpg.skillsDatabase[6].level>=3){rpg.skillsDatabase[10].unlocked=true;}
      if(rpg.skillsDatabase[6].level>=3){rpg.skillsDatabase[11].unlocked=true;}
      //magician
      if(rpg.skillsDatabase[12].level>=3){rpg.skillsDatabase[13].unlocked=true;}
      if(rpg.skillsDatabase[14].level>=3){rpg.skillsDatabase[15].unlocked=true;}
      if(rpg.skillsDatabase[16].level>=3){rpg.skillsDatabase[17].unlocked=true;}

      for(var i=0; i<rpg.skillsDatabase.length; i++){
        if(rpg.skillsDatabase[i].level===5){rpg.skillsDatabase[i].complete=true;}
      }
      //update to rpg.skills
      var tempFilter = rpg.skills.filter(function(el){if(el.name===skill.name){return el;}});
      if(tempFilter.toString()){tempFilter[0].level = skill.level;}
      else{rpg.skills.push(skill);}
    }
    rpg.userSkillCheck= function(skillsDatabase, skill){
      for(var i=0; i<skillsDatabase.length; i++){skillsDatabase[i].selected = false;}
      skill.selected = true;

      userSkillSelected = rpg.skillsDatabase.filter(function(el){return el.selected});
      rpg.userSkillSelectedDescription = userSkillSelected[0].description;
      rpg.userSkillSelectedMp = userSkillSelected[0].mpCost;
      rpg.userSkillSelectedPrerequisite = userSkillSelected[0].prerequisite;
      rpg.userSkillSelectedUnlocked = userSkillSelected[0].unlocked;
    }
    rpg.exitSkills = function(){
      rpg.userInfoSkills = false;
      rpg.userInfoOptions=true;
    }

    //enter userInfoItems
    var userItemSelectedItem = [];
    rpg.choosenCategory = '';
    rpg.enterItems = function(){
      rpg.userInfoItems = true;
      rpg.userInfoOptions=false;

      for(var i=0; i<rpg.items.length; i++){rpg.items[i].userItemSelected = false;}
      rpg.items[0].userItemSelected = true;
      rpg.userItemSelectedDescription = rpg.items[0].shortDescription;
      userItemSelectedItem = rpg.items.filter(function(el){return el.userItemSelected});
      rpg.userItemSelectedCategory = rpg.items[0].category;
    }

    rpg.userItemCheck= function(items, item){
      for(var i=0; i<items.length; i++){items[i].userItemSelected = false;}
      item.userItemSelected = true;

      userItemSelectedItem = rpg.items.filter(function(el){return el.userItemSelected});
      rpg.userItemSelectedDescription = userItemSelectedItem[0].shortDescription;
    }

    rpg.inventoryItemUse=function(){
      //console.log(rpg.items);
      //console.log(userItemSelectedItem[0]);
      if(userItemSelectedItem[0].num>0){
      userItemSelectedItem[0].num--;
      rpg.user.hp += userItemSelectedItem[0].hp;
      rpg.user.mp += userItemSelectedItem[0].mp;
      if(rpg.user.mp>rpg.user.maxMp){rpg.user.hp=rpg.user.maxMp;}
      if(rpg.user.hp>rpg.user.maxHp){rpg.user.hp=rpg.user.maxHp;}
      }
    }

    rpg.inventoryItemCancel = function(){
      rpg.userInfoItems = false; rpg.userInfoOptions=true;
      rpg.items = rpg.items.filter(function(el){if(el.num!==0){return el;}});
    }

    //enter userInfoEquipments

    rpg.equipments = [];

    rpg.equipeds = [];


    var userEquipmentSelectedItem = [];
    rpg.choosenEquipmentCategory = 'equiped';
    rpg.userInfoEquipmentEquiped = true;

    rpg.enterEquipments = function(){
      rpg.userInfoEquipments = true;
      rpg.userInfoOptions=false;

      for(var i=0; i<rpg.equipments.length; i++){rpg.equipments[i].userEquipmentSelected = false;}
      rpg.equipments[0].userEquipmentSelected = true;
      userEquipmentSelectedEquip = rpg.equipments.filter(function(el){return el.userEquipmentSelected});
      rpg.userEquipmentSelectedDescription = rpg.equipments[0].shortDescription;
    }

    rpg.userEquipmentCheck= function(equipments, equipment){
      for(var i=0; i<equipments.length; i++){equipments[i].userEquipmentSelected = false;}
      equipment.userEquipmentSelected = true;

      userEquipmentSelectedEquip = rpg.equipments.filter(function(el){return el.userEquipmentSelected});
      rpg.userEquipmentSelectedDescription = userEquipmentSelectedEquip[0].shortDescription;
    }

    rpg.equip=function(){
      var filterCategoryTemp = rpg.equipeds.filter(function(el){if(el.categoryRef===userEquipmentSelectedEquip[0].categoryRef){return el;}});

      if(filterCategoryTemp.toString()){
        rpg.user.maxHp -= filterCategoryTemp[0].maxHp;
        rpg.user.maxMp -= filterCategoryTemp[0].maxMp;
        rpg.user.str -= filterCategoryTemp[0].str;
        rpg.user.def -= filterCategoryTemp[0].def;
        rpg.user.int -= filterCategoryTemp[0].int;
        rpg.user.speed -= filterCategoryTemp[0].speed;
        filterCategoryTemp[0].num++;

        rpg.equipeds = rpg.equipeds.filter(function(el){if(el.categoryRef !== filterCategoryTemp[0].category){return el;}});
        userEquipmentSelectedEquip[0].num--;
        userEquipmentSelectedEquip[0].userEquipmentSelected =false;
        rpg.equipeds.push(userEquipmentSelectedEquip[0]);
        if(filterCategoryTemp[0].num===1){
          rpg.equipments.push(filterCategoryTemp[0]);
        }
        rpg.equipments = rpg.equipments.filter(function(el){if(el.num>0){return el}});
      }
      else{
        userEquipmentSelectedEquip[0].num--;
        rpg.equipeds.push(userEquipmentSelectedEquip[0]);
        rpg.equipments = rpg.equipments.filter(function(el){if(el.num>0){return el}});
      }

      rpg.user.maxHp += userEquipmentSelectedEquip[0].maxHp;
      rpg.user.maxMp += userEquipmentSelectedEquip[0].maxMp;
      rpg.user.str += userEquipmentSelectedEquip[0].str;
      rpg.user.def += userEquipmentSelectedEquip[0].def;
      rpg.user.int += userEquipmentSelectedEquip[0].int;
      rpg.user.speed += userEquipmentSelectedEquip[0].speed;
    }
    rpg.userEquipedCheck= function(equipeds, equiped){
      for(var i=0; i<equipeds.length; i++){equipeds[i].userEquipedSelected = false;}
      equiped.userEquipedSelected = true;

      userEquipedSelectedEquip = rpg.equipeds.filter(function(el){return el.userEquipedSelected});
      rpg.userEquipedSelectedDescription = userEquipedSelectedEquip[0].shortDescription;
    }

    rpg.unequip=function(){
      for(var i=0; i<rpg.equipeds.length; i++){rpg.equipeds[i].userEquipedSelected = false;}
      var filterNameTemp = rpg.equipments.filter(function(el){if(el.name===userEquipedSelectedEquip[0].name){return el;}});
      if(filterNameTemp.toString()){filterNameTemp[0].num++;}
      else{rpg.equipments.push({'name' : userEquipedSelectedEquip[0].name, 'num' : 1, 'price': userEquipedSelectedEquip[0].price,'maxHp': userEquipedSelectedEquip[0].maxHp, 'maxMp': userEquipedSelectedEquip[0].maxMp, 'str': userEquipedSelectedEquip[0].str, 'def': userEquipedSelectedEquip[0].def, 'int':userEquipedSelectedEquip[0].int, 'speed':userEquipedSelectedEquip[0].speed, 'equiped': false, 'category': userEquipedSelectedEquip[0].category, 'categoryRef': userEquipedSelectedEquip[0].categoryRef, 'shortDescription': userEquipedSelectedEquip[0].shortDescription});}

      rpg.user.maxHp -= filterNameTemp[0].maxHp;
      rpg.user.maxMp -= filterNameTemp[0].maxMp;
      rpg.user.str -= filterNameTemp[0].str;
      rpg.user.def -= filterNameTemp[0].def;
      rpg.user.int -= filterNameTemp[0].int;
      rpg.user.speed -= filterNameTemp[0].speed;
      rpg.equipeds = rpg.equipeds.filter(function(el){if(el.category !== userEquipedSelectedEquip[0].category){return el;}});

    }

    rpg.equipCancel = function(){
      rpg.userInfoEquipments = false;
      rpg.userInfoOptions=true;
    }

    //enter shop
  function enterShop(stage){
    //map.show=false;
    rpg.shopShow=true;
    rpg.userInfoIconShow = false;

    //currentMapIndex = map.index-1;
    if(stage.index === 34){
      rpg.shop = [{'index': 1, 'name': 'Red potion', 'price': '8','fn': 'redPotion(item)', 'hp': 50, 'mp': 0, 'category': 'consumables', 'shortDescription': 'Heal 50 hp','description' : 'Red potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                  {'index': 2, 'name': 'Blue potion', 'price': '8', 'fn': 'bluePotion(item)','hp': 0, 'mp': 50,  'category': 'consumables', 'shortDescription': 'Heal 50 mp','description' : 'Blue potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                  {'index': 11,'name': 'Hat1', 'price': 100, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 10, 'int':0, 'speed':0, 'equiped': false, 'category': 'headgear', 'categoryRef': 'headgear', 'shortDescription': 'increases 10 def'},
                  {'index': 14,'name': 'Body1', 'price': 200, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 15, 'int':0, 'speed':0, 'equiped': false, 'category': 'body','categoryRef': 'body',  'shortDescription': 'increases 15 def'},
                  {'index': 17,'name': 'Sword1', 'price': 300, 'maxHp': 0, 'maxMp': 0, 'str': 10, 'def': 0, 'int':0, 'speed':0, 'equiped': false, 'category': 'weapon', 'categoryRef': 'weapon','shortDescription': 'increases 10 str'},
                  {'index': 20,'name': 'Staff1', 'price': 300, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 0, 'int':10, 'speed':0, 'equiped': false, 'category': 'weapon', 'categoryRef': 'weapon','shortDescription': 'increases 10 int'}];
    }else if(stage.index === 35){
      rpg.shop = [{'index': 3, 'name': 'Orange potion', 'price': '20','fn': 'orangePotion(item)', 'hp': 100, 'mp': 0, 'category': 'consumables', 'shortDescription': 'Heal 100 hp','description' : 'Orange potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                {'index': 4, 'name': 'Navy potion', 'price': '20', 'fn': 'navyPotion(item)', 'hp': 0, 'mp': 100, 'category': 'consumables', 'shortDescription': 'Heal 100 mp','description' : 'Navy potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                {'index': 5, 'name': 'Green potion', 'price': '35', 'fn': 'greenPotion(item)', 'hp': 75, 'mp': 75, 'category': 'consumables', 'shortDescription': 'Heal 75 hp and 75 mp','description' : 'Green potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
                {'index': 12,'name': 'Hat2', 'price': 250, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 15, 'int':0, 'speed':0, 'equiped': false, 'category': 'headgear', 'categoryRef': 'headgear', 'shortDescription': 'increases 15 def'},
                {'index': 15,'name': 'Body2', 'price': 400, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 20, 'int':0, 'speed':0, 'equiped': false, 'category': 'body', 'categoryRef': 'body','shortDescription': 'increases 20 def'},
                {'index': 18,'name': 'Sword2', 'price': 500, 'maxHp': 0, 'maxMp': 0, 'str': 20, 'def': 0, 'int':0, 'speed':0, 'equiped': false, 'category': 'weapon', 'categoryRef': 'weapon','shortDescription': 'increases 20 str'},
                {'index': 21,'name': 'Staff2', 'price': 500, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 0, 'int':20, 'speed':0, 'equiped': false, 'category': 'weapon', 'categoryRef': 'weapon','shortDescription': 'increases 20 int'},
                {'index': 23,'name': 'Ring1', 'price': 350,  'maxHp': 100, 'maxMp': 0, 'str': 0, 'def': 0, 'int':0, 'speed':0, 'equiped': false, 'category': 'accessory', 'categoryRef': 'accessory', 'shortDescription': 'increases 100 maxHP'}
              ];
  } else if(stage.index === 36){
    rpg.shop = [{'index': 6, 'name': 'Yellow potion', 'price': '40','fn': 'yellowPotion(item)', 'hp': 200, 'mp': 0, 'category': 'consumables', 'shortDescription': 'Heal 200 hp','description' : 'Yellow potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
              {'index': 7, 'name': 'Purple potion', 'price': '40', 'fn': 'purplePotion(item)', 'hp': 0, 'mp': 200, 'category': 'consumables', 'shortDescription': 'Heal 200 mp','description' : 'Purple potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
              {'index': 8, 'name': 'Gray potion', 'price': '60', 'fn': 'grayPotion(item)', 'hp': 150, 'mp': 150, 'category': 'consumables', 'shortDescription': 'Heal 150 hp and 150 mp','description' : 'Gray potion. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
              {'index': 13,'name': 'Hat3', 'price': 400, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 25, 'int':0, 'speed':0, 'equiped': false, 'category': 'headgear', 'categoryRef': 'headgear', 'shortDescription': 'increases 25 def'},
              {'index': 16,'name': 'Body3', 'price': 550, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 30, 'int':0, 'speed':0, 'equiped': false, 'category': 'body', 'categoryRef': 'body','shortDescription': 'increases 30 def'},
              {'index': 19,'name': 'Sword3', 'price': 800, 'maxHp': 0, 'maxMp': 0, 'str': 30, 'def': 0, 'int':0, 'speed':0, 'equiped': false, 'category': 'weapon', 'categoryRef': 'weapon','shortDescription': 'increases 30 str'},
              {'index': 22,'name': 'Staff3', 'price': 800, 'maxHp': 0, 'maxMp': 0, 'str': 0, 'def': 0, 'int':30, 'speed':0, 'equiped': false, 'category': 'weapon', 'categoryRef': 'weapon','shortDescription': 'increases 30 int'},
              {'index': 24,'name': 'Ring2', 'price': 500,  'maxHp': 100, 'maxMp': 200, 'str': 0, 'def': 0, 'int':0, 'speed':0, 'equiped': false, 'category': 'accessory', 'categoryRef': 'accessory', 'shortDescription': 'increases 100 maxHP and 200 maxMp'}];}
}

    rpg.shop[0].selected = true;
    var selectedItem = rpg.shop.filter(function(el){return el.selected});
    rpg.selectedDescription = selectedItem[0].description;

    rpg.enterBuy = function(){
      rpg.shopBuyShow = true;
      rpg.shopFrontShow = false;

      for(var i=0; i<rpg.shop.length; i++){rpg.shop[i].selected = false;}
      rpg.shop[0].selected = true;

      //update available item num
      selectedItem = rpg.shop.filter(function(el){return el.selected});
      rpg.selectedDescription = selectedItem[0].shortDescription;

      itemAmount = rpg.items.filter(function(el){if(el.name === selectedItem[0].name){return el}});
      if(itemAmount.toString()){rpg.itemSelectedNum = itemAmount[0].num;}
      else{rpg.itemSelectedNum = 0;}
    }
    rpg.itemBuyCheck= function(items, item){
      for(var i=0; i<items.length; i++){items[i].selected = false;}
      item.selected = true;
      selectedItem = rpg.shop.filter(function(el){return el.selected});
      rpg.selectedDescription = selectedItem[0].shortDescription;
      if(selectedItem[0].category==='consumables'){
        itemAmount = rpg.items.filter(function(el){if(el.name === selectedItem[0].name){return el}});
      }
      else{
      itemAmount = rpg.equipments.filter(function(el){if(el.name === selectedItem[0].name){return el}});
      }
      if(itemAmount.toString()){rpg.itemSelectedNum = itemAmount[0].num;}
      else{rpg.itemSelectedNum = 0;}
    }

    var itemChosen = [], itemCheck = [];
    rpg.buyItem = function(){
      //purchase items
      if(rpg.user.crowne < selectedItem[0].price){}
      else{
        if(selectedItem[0].category === 'consumables'){
          rpg.user.crowne -=selectedItem[0].price;
          itemChosen = selectedItem[0];
          itemChosenCheck = rpg.items.filter(function(el){if(el.name === itemChosen.name){return el;}});
          if(itemChosenCheck.toString()){itemChosenCheck[0].num++;}
          else{rpg.items.push({'index': itemChosen.index,'name' : itemChosen.name, 'num' : 1, 'fn': itemChosen.fn,'hp': itemChosen.hp,'mp': itemChosen.mp,'category': itemChosen.category,'price': itemChosen.price,'shortDescription': itemChosen.shortDescription});}

          //update available item num
          selectedItem = rpg.shop.filter(function(el){return el.selected});
          rpg.selectedDescription = selectedItem[0].shortDescription;
          itemAmount = rpg.items.filter(function(el){if(el.name === selectedItem[0].name){return el}});
          if(itemAmount.toString()){rpg.itemSelectedNum = itemAmount[0].num;}
          else{rpg.itemSelectedNum = 0;}
        }
        else{
          rpg.user.crowne -=selectedItem[0].price;
          equipmentChosen = selectedItem[0];
          equipmentChosenCheck = rpg.equipments.filter(function(el){if(el.name === equipmentChosen.name){return el;}});
          if(equipmentChosenCheck.toString()){equipmentChosenCheck[0].num++;}
          else{rpg.equipments.push({'index': equipmentChosen.index-10,'name' : equipmentChosen.name, 'num' : 1, 'price': equipmentChosen.price,'maxHp': equipmentChosen.maxHp, 'maxMp': equipmentChosen.maxMp, 'str': equipmentChosen.str, 'def': equipmentChosen.def, 'int':equipmentChosen.int, 'speed':equipmentChosen.speed, 'equiped': false, 'category': equipmentChosen.category, 'categoryRef': equipmentChosen.categoryRef, 'shortDescription': equipmentChosen.shortDescription});}

          //update available item num
          selectedItem = rpg.shop.filter(function(el){return el.selected});
          rpg.selectedDescription = selectedItem[0].shortDescription;
          itemAmount = rpg.equipments.filter(function(el){if(el.name === selectedItem[0].name){return el}});
          if(itemAmount.toString()){rpg.itemSelectedNum = itemAmount[0].num;}
          else{rpg.itemSelectedNum = 0;}
        }
      }
    }

    for(var i=0; i<rpg.items.length; i++){rpg.items[i].sellSelected = false;}
    rpg.items[0].sellSelected = true;
    var selectedSellItem = rpg.items.filter(function(el){return el.sellSelected});
    rpg.selectedSellDescription = selectedSellItem[0].shortDescription;

    rpg.enterSell = function(){
      rpg.shopSellShow = true;
      rpg.shopFrontShow = false;

      if(rpg.items.toString()){
        for(var i=0; i<rpg.items.length; i++){rpg.items[i].sellSelected = false;}
        rpg.items[0].sellSelected = true;
        var selectedSellItem = rpg.items.filter(function(el){return el.sellSelected});
      }
      else{
        for(var i=0; i<rpg.equipments.length; i++){rpg.equipments[i].sellSelected = false;}
        rpg.equipments[0].sellSelected = true;
        var selectedSellItem = rpg.equipments.filter(function(el){return el.sellSelected});
      }
      rpg.selectedSellDescription = selectedSellItem[0].shortDescription;

    }
    rpg.itemSellCheck= function(items, item){
      for(var i=0; i<rpg.equipments.length; i++){rpg.equipments[i].sellSelected = false;}
      for(var i=0; i<items.length; i++){items[i].sellSelected = false;}
      item.sellSelected = true;
      selectedSellItem = rpg.items.filter(function(el){return el.sellSelected});
      rpg.selectedSellDescription = selectedSellItem[0].shortDescription;
      var itemSellCheck=1;
    }
    rpg.itemSellCheckEq= function(equipments, equip){
      for(var i=0; i<rpg.items.length; i++){rpg.items[i].sellSelected = false;}
      for(var i=0; i<equipments.length; i++){equipments[i].sellSelected = false;}
      equip.sellSelected = true;
      selectedSellItem = rpg.equipments.filter(function(el){return el.sellSelected});
      rpg.selectedSellDescription = selectedSellItem[0].shortDescription;
      var itemSellCheck=1;
    }

    rpg.sellItem = function(){
      itemSellChosen = selectedSellItem[0];
      if(selectedSellItem[0].category==='consumables'){
        itemSellChosenCheck = rpg.items.filter(function(el){if(el.name === itemSellChosen.name){return el;}});
      }
      else{
        itemSellChosenCheck = rpg.equipments.filter(function(el){if(el.name === itemSellChosen.name){return el;}});
      }
      if(itemSellChosenCheck.toString()){
        if(itemSellChosenCheck[0].num<=0){}
        else{rpg.user.crowne +=selectedItem[0].price/2; itemSellChosenCheck[0].num--};
      }
    }
    rpg.exitSell = function(){
      rpg.items = rpg.items.filter(function(el){if(el.num >0){return el;}});
      rpg.equipments = rpg.equipments.filter(function(el){if(el.num >0){return el;}});
      rpg.shopSellShow = false;
      rpg.shopFrontShow = true;
    }
    rpg.exitShop = function(){
      rpg.userInfoIconShow = true;
      rpg.shopShow=false;
      rpg.maps[currentMapIndex].show=true;
      rpg.try=0;
    }

    //start battle
    rpg.start= function(map, stage){
      if(stage.unlocked && stage.index <34){
        rpg.userInfoOptions = false;
        rpg.userInfoIconShow = false;
        stageCounter = stage.index;
        rpg.actionShow=true;
        rpg.userShow = true;

        //rpg.worldMapStages = false;

        //reset
        winEnemy1=0;
        winEnemy2=0;
        winEnemy3=0;
        expTotal = 0;
        crowneTotal = 0;

        currentMapIndex = map.index-1;
        //if(currentMapIndex === 0){mapOne();}
        //else if(currentMapIndex === 1){mapTwo();}
        //else if(currentMapIndex === 2){mapThree();}
        enemiesMap();
        //initiate the initial enemy selection
        var selectedEnemy = rpg.enemies.filter(function(enemy){return enemy.click;});

        //user
        rpg.enemySelect = function(enemies, enemy){
          for(var i=0; i<enemies.length; i++){enemies[i].click = false;}
          enemy.click = true;
          selectedEnemy = rpg.enemies.filter(function(enemy){return enemy.click;});
        }

        rpg.userAttack = function(){
          selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
          selectedEnemy[0].hp -= Math.floor(rpg.user.damage*(100-selectedEnemy[0].def)/100);
          userTurnFn(selectedEnemy);
          userWin();
        }

        rpg.run = function(){

          rpg.userShow = false;
          rpg.skillShow = false;
          rpg.userWaitShow = true;
          //end the cool down
          userTurn = $timeout(function(){rpg.userShow = true;rpg.userWaitShow = false;
            var runSuccessChance = '', chance = 50, randomChanceNum = 0;
            randomChanceNum = Math.floor(Math.random()*100);
            if(randomChanceNum > chance){runSuccessChance = true}
            else{runSuccessChance = false}
            if(runSuccessChance){
              $interval.cancel(enemyOneTurn);
              $interval.cancel(enemyTwoTurn);
              $interval.cancel(enemyThreeTurn);
              rpg.runSuccessShow = true;
              rpg.userShow = false;
              rpg.runSuccess = function(){ rpg.userInfoIconShow = true; rpg.actionShow = false; rpg.runSuccessShow = false;rpg.try=0;}
            }else{
              rpg.runFailureShow = true;
              rpg.userShow = false;

              rpg.runFailure=function(){
                rpg.runFailureShow = false;
                rpg.userShow = true;
              }
            }
          },rpg.user.coolDown);
        }

        function skillNoMp(){
          rpg.userShow = false;
          rpg.skillNoMpShow = true;
          rpg.skillShow = false;
          $timeout(function(){rpg.skillNoMpShow = false; rpg.skillShow = true; rpg.userShow = false;},500);
        }

        //SKILLS
        function skillTotal(){
          //ROGUE
          rpg.dirtyStab = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost; selectedEnemy = rpg.enemies.filter(function(el){return el.click;}); selectedEnemy[0].hp -= Math.floor(rpg.user.damage*(1+(skill.level/3))); userTurnFn(selectedEnemy); userWin();}
          }

          rpg.backStab = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;});selectedEnemy[0].def *= 1-(skill.level*.1); $timeout(function(){selectedEnemy[0].def*= (1/(1-(0.1*skill.level)))},10000);userTurnFn(selectedEnemy);}
          }

          rpg.speedDown = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;});selectedEnemy[0].time += skill.level*500; $timeout(function(){selectedEnemy[0].time -= skill.level*500;},10000); userTurnFn(selectedEnemy);}
          }

          rpg.attackDown = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;});selectedEnemy[0].damage *= 1-(skill.level*.1); $timeout(function(){selectedEnemy[0].damage*= (1/(1-(0.1*skill.level)))},10000);userTurnFn(selectedEnemy);}
          }

          var poisonCounter  = 0;
          rpg.poison = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
              poisonCounter++;
              if(poisonCounter===1){
                var poisonedEnemy1 = rpg.enemies.filter(function(el){if(el.index === selectedEnemy[0].index){return el;}});
                if(poisonedEnemy1[0].poisoned === false || poisonedEnemy1[0].poisoned === undefined){
                  rpg.user.mp -= skill.mpCost;
                  var poisonDamage1 = $interval(function(){ poisonedEnemy1[0].poisoned = true; poisonedEnemy1[0].hp-= (5*skill.level);
                    if(poisonedEnemy1[0].hp<=0){$interval.cancel(poisonDamage1); userWin();}
                  },500);
                  $timeout(function(){$interval.cancel(poisonDamage1); poisonedEnemy1[0].poisoned = false; poisonCounter--;},5000);
                }
              }
              else if(poisonCounter===2){
                var poisonedEnemy2 = rpg.enemies.filter(function(el){if(el.index === selectedEnemy[0].index){return el;}});
                if(poisonedEnemy2[0].poisoned === false || poisonedEnemy2[0].poisoned === undefined){
                  rpg.user.mp -= skill.mpCost;
                  var poisonDamage2 = $interval(function(){ poisonedEnemy2[0].poisoned = true; poisonedEnemy2[0].hp -= (5*skill.level);
                    if(poisonedEnemy2[0].hp<=0){$interval.cancel(poisonDamage2); userWin();}
                  },500);
                  $timeout(function(){$interval.cancel(poisonDamage2); poisonedEnemy2[0].poisoned = false; poisonCounter--;},5000);
                }
              }
              else if(poisonCounter===3){
                var poisonedEnemy3 = rpg.enemies.filter(function(el){if(el.index === selectedEnemy[0].index){return el;}});
                if(poisonedEnemy3[0].poisoned === false || poisonedEnemy3[0].poisoned === undefined){
                  rpg.user.mp -= skill.mpCost;
                  var poisonDamage3 = $interval(function(){ poisonedEnemy3[0].poisoned = true; poisonedEnemy3[0].hp -= (5*skill.level);
                    if(poisonedEnemy3[0].hp<=0){$interval.cancel(poisonDamage3); userWin();}
                  },500);
                  $timeout(function(){$interval.cancel(poisonDamage3); poisonedEnemy3[0].poisoned = false; poisonCounter--;},5000);
                }
              }

              userTurnFn(selectedEnemy);
            }
          }

          rpg.gameCheat = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;}); selectedEnemy[0].hp -= 999 ; userTurnFn(selectedEnemy);userWin();}
          }

          //KNIGHT
          rpg.hit = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost; selectedEnemy = rpg.enemies.filter(function(el){return el.click;});selectedEnemy[0].hp -=Math.floor(rpg.user.damage*(1+(skill.level/4))); userTurnFn(selectedEnemy);userWin();}
          }

          rpg.harderHit = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost; selectedEnemy = rpg.enemies.filter(function(el){return el.click;});selectedEnemy[0].hp -=Math.floor(rpg.user.damage*(1+(skill.level/3))); userTurnFn(selectedEnemy);userWin();}
          }

          rpg.hardestHit = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost; selectedEnemy = rpg.enemies.filter(function(el){return el.click;});selectedEnemy[0].hp -=Math.floor(rpg.user.damage*(1+(skill.level/1.5))); userTurnFn(selectedEnemy);userWin();}
          }

          rpg.defenseUp = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;}); rpg.user.def += (10*skill.level); $timeout(function(){rpg.user.def -= (10*skill.level)},10000); attack=false; userTurnFn(selectedEnemy);}
          }

          rpg.attackUp = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;});rpg.user.damage += (20*skill.level);$timeout(function(){rpg.user.damage -= (20*skill.level)},10000);attack=false; userTurnFn(selectedEnemy);}
          }

          rpg.speedUp = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{rpg.user.mp -= skill.mpCost;selectedEnemy = rpg.enemies.filter(function(el){return el.click;});rpg.user.coolDown -= (200*skill.level); $timeout(function(){rpg.user.coolDown += (200*skill.level)},10000); attack=false; userTurnFn(selectedEnemy);}
          }

          //MAGICIAN
          rpg.fireArrow = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              rpg.user.mp -= skill.mpCost;
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;}); selectedEnemy[0].hp -= Math.floor(rpg.user.magicDamage*(1+(skill.level/4)));
              userTurnFn(selectedEnemy); userWin();
            }
          }

          var flameHookCounter  = 0;
          rpg.flameHook = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
              flameHookCounter++;
              if(flameHookCounter===1){
                var flameHookedEnemy1 = rpg.enemies.filter(function(el){if(el.index === selectedEnemy[0].index){return el;}});
                if(flameHookedEnemy1[0].flameHooked === false || flameHookedEnemy1[0].flameHooked === undefined){
                  rpg.user.mp -= skill.mpCost;
                  var flameHookDamage1 = $interval(function(){ flameHookedEnemy1[0].flameHooked = true; flameHookedEnemy1[0].hp-= Math.floor(rpg.user.magicDamage*(0.5)*skill.level);
                    if(flameHookedEnemy1[0].hp<=0){$interval.cancel(flameHookDamage1)};userWin();},1000);
                  $timeout(function(){$interval.cancel(flameHookDamage1); flameHookedEnemy1[0].flameHooked = false; flameHookCounter--;},5000);
                }
              }
              else if(flameHookCounter===2){
                var flameHookedEnemy2 = rpg.enemies.filter(function(el){if(el.index === selectedEnemy[0].index){return el;}});
                if(flameHookedEnemy2[0].flameHooked === false || flameHookedEnemy2[0].flameHooked === undefined){
                  rpg.user.mp -= skill.mpCost;
                  var flameHookDamage2 = $interval(function(){ flameHookedEnemy2[0].flameHooked = true; flameHookedEnemy2[0].hp -= Math.floor(rpg.user.magicDamage*(0.5)*skill.level);
                    if(flameHookedEnemy2[0].hp<=0){$interval.cancel(flameHookDamage2)};userWin();},1000);
                  $timeout(function(){$interval.cancel(flameHookDamage2); flameHookedEnemy2[0].flameHooked = false; flameHookCounter--;},5000);
                }
              }
              else if(flameHookCounter===3){
                var flameHookedEnemy3 = rpg.enemies.filter(function(el){if(el.index === selectedEnemy[0].index){return el;}});
                if(flameHookedEnemy3[0].flameHooked === false || flameHookedEnemy3[0].flameHooked === undefined){
                  rpg.user.mp -= skill.mpCost;
                  var flameHookDamage3 = $interval(function(){ flameHookedEnemy3[0].flameHooked = true; flameHookedEnemy3[0].hp -= Math.floor(rpg.user.magicDamage*(0.5)*skill.level);
                    if(flameHookedEnemy3[0].hp<=0){$interval.cancel(flameHookDamage3)};userWin();},1000);
                  $timeout(function(){$interval.cancel(flameHookDamage3); flameHookedEnemy3[0].flameHooked = false; flameHookCounter--;},5000);
                }
              }

              userTurnFn(selectedEnemy);}
          }

          rpg.lightningBolt = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              rpg.user.mp -= skill.mpCost;
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
              selectedEnemy[0].hp -= Math.floor(rpg.user.magicDamage*(1+(skill.level/4)));
              userTurnFn(selectedEnemy); userWin();
            }
          }

          rpg.sparkBlitz = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              rpg.user.mp -= skill.mpCost;
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
              selectedEnemy[0].hp -= Math.floor(rpg.user.magicDamage*(1+(skill.level/2)));
              userTurnFn(selectedEnemy); userWin();
            }
          }

          rpg.iceSpear = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              rpg.user.mp -= skill.mpCost;
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
              selectedEnemy[0].hp -= Math.floor(rpg.user.magicDamage*(1+(skill.level/4)));
              userTurnFn(selectedEnemy); userWin();
            }
          }

          rpg.icebergFreeze = function(skill){
            if(rpg.user.mp < skill.mpCost){skillNoMp();}
            else{
              selectedEnemy = rpg.enemies.filter(function(el){return el.click;});
              var iceFreezeTime = 1500 * skill.level;
              rpg.user.mp -= skill.mpCost;
              $interval.cancel(enemyOneTurn);
              $interval.cancel(enemyTwoTurn);
              $interval.cancel(enemyThreeTurn);
              $timeout(function(){enemyTurn();},iceFreezeTime);
              attack=false; userTurnFn(selectedEnemy); userWin();

            }
          }
        };

        skillTotal();
        enemyTurn();
      }
      else if(stage.unlocked && stage.index >=34){
        enterShop(stage);
      }
    }

    rpg.unlock = false;
    rpg.next = function(){
      rpg.unlock=false;
      rpg.winShow=false;
      $interval.cancel(enemyOneTurn);
      $interval.cancel(enemyTwoTurn);
      $interval.cancel(enemyThreeTurn);

      //rpg.currentMapIndex = currentMapIndex;
      //rpg.latestMap = latestMap;

      var unlockedStages, latestStage;

      if(levelUpCounter){
        rpg.winShow=false;
        rpg.levelUpShow=true;
        levelUpCounter = false;
      }
      else{
        rpg.actionShow=false;
        rpg.winShow = false;
        rpg.worldMapStages=true;
        rpg.unlock = true;
        rpg.userInfoIconShow = true;

        unlockedStages = rpg.mapFull.filter(function(el){if(el.unlocked && el.index <33){return el;}});
        rpg.latestStage = unlockedStages[unlockedStages.length-1].index + 1;
        rpg.mapFull[stageCounter].unlocked=true;
        if(rpg.mapFull[2].unlocked===true){rpg.mapFull[33].unlocked=true}
        if(rpg.mapFull[12].unlocked===true){rpg.mapFull[34].unlocked=true}
        if(rpg.mapFull[25].unlocked===true){rpg.mapFull[35].unlocked=true}
      }
    }



    rpg.loseBack = function(){
      rpg.try=0;
      rpg.actionShow=false;
      rpg.loseShow = false;
      rpg.user.hp = rpg.user.maxHp;
      rpg.user.mp = rpg.user.maxMp;
      $interval.cancel(enemyOneTurn);
      $interval.cancel(enemyTwoTurn);
      $interval.cancel(enemyThreeTurn);
      rpg.userInfoIconShow = true;
    }

    rpg.nextLevelUp = function(){
      rpg.winShow=false;
      rpg.userInfoIconShow = true;
      rpg.levelUpShow = false;
      rpg.actionShow=false;
      rpg.worldMapStages=true;
      rpg.unlock = true;
      //var unlockedStages, latestStage;
      unlockedStages = rpg.mapFull.filter(function(el){if(el.unlocked && el.index <33){return el;}});
      rpg.latestStage = unlockedStages[unlockedStages.length-1].index + 1;
      rpg.mapFull[stageCounter].unlocked=true;
      if(rpg.mapFull[1].unlocked===true){rpg.mapFull[33].unlocked=true}
      if(rpg.mapFull[12].unlocked===true){rpg.mapFull[34].unlocked=true}
      if(rpg.mapFull[24].unlocked===true){rpg.mapFull[35].unlocked=true}
    }

    rpg.exit = function(map){
      map.show = false;
      rpg.worldMapShow=true
      rpg.userInfoOptions=false;
    }

    /*************************
    FUNCTIONS
    *************************/
    //item
    /*rpg.redPotion = function(item){
      if(rpg.user.hp === rpg.user.maxHp || item.num === 0){}
      else{
        item.num -= 1;
        rpg.user.hp += 20;
      }
    }

    rpg.greenPotion = function(item){
      if(rpg.user.hp === rpg.user.maxHp || item.num === 0){}
      else{
        item.num -= 1;
        rpg.user.hp += 40;
      }
    }

    rpg.bluePotion = function(item){
      if(rpg.user.mp === rpg.user.maxMp || item.num === 0){}
      else{
        item.num -= 1;
        rpg.user.mp += 20;
      }
    }

    rpg.speedMedal = function(item){
      item.num -=1;
      rpg.user.coolDown -= 500;
      var speedMedalReset = $timeout(function(){
        rpg.user.coolDown += 500;
      },4000);
    }

    rpg.attackMedal = function(item){
      item.num -=1;
      rpg.user.damage += 100;
      var userDamageReset = $timeout(function(){
        rpg.user.damage -= 100;
      },4000);
    }*/

    //save game

    rpg.saveGame = function(){
      rpg.saveShow=true;
      rpg.userInfoOptions = false;
      rpg.userInfoIconShow=true;
      //rpg.mapFull
        localStorage.setItem('mapKey', JSON.stringify(rpg.mapFull));
      //rpg.userName
        localStorage.setItem('userNameKey', JSON.stringify(rpg.userName));
      //rpg.user
        localStorage.setItem('userKey', JSON.stringify(rpg.user));
      //rpg.items
        localStorage.setItem('itemsKey', JSON.stringify(rpg.items));
      //rpg.equipments
        localStorage.setItem('equipmentsKey', JSON.stringify(rpg.equipments));
      //rpg.equiped
        localStorage.setItem('equipedsKey', JSON.stringify(rpg.equipeds));
      //rpg.skillsDatabase
        localStorage.setItem('skillsDatabaseKey', JSON.stringify(rpg.skillsDatabase));
      //rpg.skills
        localStorage.setItem('skillsKey', JSON.stringify(rpg.skills));
    };

    //load game

    rpg.loadGame = function(){
      if(localStorage.getItem('mapKey')===null){
        rpg.loadNothingShow=true;
      }
      else{

      rpg.loadShow=true;
      //console.log('yes');
      //rpg.mapFull
        rpg.mapFull = JSON.parse(localStorage.getItem('mapKey'));
      //rpg.userName
        rpg.userName = JSON.parse(localStorage.getItem('userNameKey'));
      //rpg.user
        rpg.user = JSON.parse(localStorage.getItem('userKey'));
      //rpg.items
        rpg.items = JSON.parse(localStorage.getItem('itemsKey'));
      //rpg.equipments
        rpg.equipments = JSON.parse(localStorage.getItem('equipmentsKey'));
      //rpg.equiped
        rpg.equipeds = JSON.parse(localStorage.getItem('equipedsKey'));
      //rpg.skillsDatabase
        rpg.skillsDatabase = JSON.parse(localStorage.getItem('skillsDatabaseKey'));
      //rpg.skillsDatabase
        rpg.skills = JSON.parse(localStorage.getItem('skillsKey'));
        //console.log(rpg.maps);

        rpg.maps[0].show= false;
        rpg.maps[1].show= false;
        rpg.maps[2].show= false;
      }
    };





  });
