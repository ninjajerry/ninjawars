<?php

// TODO: Oh god, these functions need templates.


/**
 * This determines how the clans get ranked and tagged, and how to only show non-empty clans.
**/
function player_size(){
    $res = array();
    $db = new DBAccess();
    $sel = "select (level-3-round(days/5)) as sum, player_id, uname from players where confirmed = 1 and health>0 order by sum desc";
    $counts = $db->FetchAll($sel);
    $largest = reset($counts);
    $max = $largest['sum'];
    foreach($counts as $player_info){
        // make percentage of highest, multiply by 10 and round to give a 1-10 size
        $res[$player_info['uname']] = array('player_id'=>$player_info['player_id'],
        	'size'=>
             floor(( (($player_info['sum']-1 <1? 0 : $player_info['sum']-1)) /$max)*10)+1
             );
    }
    return $res;
}

function render_player_tags(){
    $players = player_size();
    //$clans = @natsort2d($clans, 'level');
    $res = "<div id='player-tags'>
                <h4 id='player-tags-title'>
                    All Players
                </h4>
            <ul>";
    foreach($players as $player => $info){
        $res .= "<li class='player-tag size{$info['size']}'>
                <a href='player.php?player_id=".urlencode($info['player_id'])."'>$player</a>
            </li>";
    }
    $res .= "</ul>
            </div>";
    return $res;
}




// Display the recently active players
function render_active($limit=5, $alive_only=true) {
	$where_cond = ($alive_only? 'and health>0' : '');
	$sel = "select uname, player_id from players where confirmed=1 $where_cond order by last_started_attack desc limit $limit";
	$sql = new DBAccess();
	$res = $sql->QueryAssoc($sel);
	$out = "
    <div class='active-players'>
      <ul>
        <li><span>Lurking ninja: </span></li>
	";
	foreach ($res as $ninja) {
		$out .= "        <li class='active-ninja'><a href='player.php?target_id=".$ninja['player_id']."'>".$ninja['uname']."</a></li>";
	}
	$out .= "
      </ul>
    </div>
    ";
    return $out;
}

// Displays the search section of the page.
function display_search_form($hide, $page, $searched, $dead_count){
    echo "<div class='list-all-players-search centered'>";
    echo "  <form action=\"list_all_players.php\" method=\"get\">";
	echo "    <div>\n";
    echo "      <input type=\"text\" name=\"searched\" class='textField' style=\"font-family:Verdana, Arial;font-size:xx-small;\">\n";
    echo "      <input type=\"hidden\" name=\"hide\" value=\"$hide\">\n";
    echo "      <input type=\"submit\" class=\"formButton\" value=\"Search for Ninja\">\n";

    if ($hide == "dead") {
        echo "<a href=\"list_all_players.php?page=$page&amp;hide=none&amp;searched=$searched\">(Show $dead_count dead ninja)</a>\n";
    } else {
        echo "<a href=\"list_all_players.php?page=$page&amp;hide=dead&amp;searched=$searched\">(Hide $dead_count dead ninja)</a>\n";
    }

	echo "    </div>\n";
    echo "  </form>\n";
    echo "</div>";
}

// Display first/previous/page/next/last
function player_list_nav($page, $hide, $searched, $record_limit, $totalrows, $numofpages) {
	echo "<div class='player-list-nav'>\n";
	echo "<form action=\"list_all_players.php\" method=\"get\">\n";
	echo "  <div>\n";

	if ($page != 1) {
		$pageprev = $page-1;
		echo "<a href=\"list_all_players.php?hide=$hide&amp;page=1&amp;searched=$searched\">&lt;First</a> | ";
		echo("<a href=\"list_all_players.php?page=$pageprev&amp;searched=$searched&amp;hide=$hide\">&lt;&lt;Previous $record_limit</a>&nbsp;| ");
	} else {
		echo "&lt;First | &lt;&lt;Previous $record_limit&nbsp; | ";
	}

	echo "<span class='current-page'>";
	echo "<input type=\"hidden\" name=\"hide\" value=\"$hide\">";
	echo "<input type=\"submit\" class=\"formButton\" value=\"Page\">";
	echo "<input type=\"hidden\" name=\"searched\" value=\"$searched\">";
	echo "<input type=\"text\" name=\"page\" value=\"$page\" style=\"font-family:Verdana, Arial;font-size:xx-small;\" size=\"3\">";
	echo "/$numofpages ";
	echo "</span>";

	if (($totalrows - ($record_limit * $page)) > 0) {
		$pagenext   = $page+1;
		echo(" | <a href=\"list_all_players.php?page=$pagenext&amp;searched=$searched&amp;hide=$hide\">Next $record_limit&gt;</a>");
		echo " | <a href=\"list_all_players.php?page=$numofpages&amp;hide=$hide&amp;searched=$searched\">Last&gt;&gt;</a>\n";
	} else {
		echo(" | Next $record_limit&gt;");
		echo " | Last&gt;&gt;\n";
	}

	echo "  </div>\n";
	echo "</form>\n";
	echo "</div>\n";
} // End of display functions.


?>
