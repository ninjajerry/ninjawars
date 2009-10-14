/* Load all the js scripts here, essentially */

// Url Resources:
// http://www.jslint.com/
// http://yuiblog.com/blog/2007/06/12/module-pattern/

// TODO: Create a dummy console.log functionality to avoid errors on live?


/*  GLOBAL SETTINGS & VARS */

function createNW(){
    var innerNW = {};
    innerNW.firstLoad = 1; 
    // Counter starts at 1 to indicate newly refreshed page, as opposed to ajax loads.
    return innerNW;
}

$ = window.$ || jQuery;
NW = window.NW || createNW();


// GLOBAL FUNCTIONS


function chainedTimeout(counter){
    var counter = counter || 1;
    updateIndex(counter);
    NW.updater_id = setTimeout(chainedTimeout, 10*1000); // Repeat once the interval has passed.
    // Also store the timeout id for any potential cancellation requests.
}       


// Update the chat page without refresh.
function updateChat(){
// store a latest chat id to check against the chat.
// Get the chat data.
// If the latest hasn't changed, just return nothing.
// If the latest has changed, return
// If the latest has changed, cycle through the data
//saving non-matches until you get back to the "latest" match.
// Update the chat's ui.
// update the "latest chat id" var.
}

function updateLastMessage(){
    if(!NW.latest_message_id){
        NW.latest_message_id = null;
    }
    $.getJSON('api.php?type=latest_message&jsoncallback=?', function(data){
        //console.log(data.chats[0].message);
        $.each(data.message, function(i,message){
            if(NW.latest_message_id == message.message_id){
                $('#recent-mail .latest-message-text').removeClass('message-unread');
                return false;
            }

            NW.latest_message_id = message.message_id; // Store latest message.
            // Add the unread class until next update.
            $('#recent-mail').html("<div class='latest-message'><a href='player.php?player="+message.send_from+"' target='main'>"+message.uname+"</a>: <span class='latest-message-text message-unread'>"+message.message.substr(0, 12)+"...</span> </div>");
            // Pull a message with a truncated length of 12.
            /*$('<a/>').attr("href", "player.php?player="+chat.send_from).text(chat.send_from+" ").appendTo('#recent-events');
            $('<span/>').text(chat.message).appendTo('#recent-events');*/
            if(i=== 0) return false;
        });
    });
}

// Update display elements that live on the index page.
function updateIndex(){

        updateLastMessage();
// Recent events.
// recent messages.
// update chat
// health bar.
}



// When clicking frame links, load a section instead of the iframe.
function frameClickHandlers(links, div){
    links.click(function(){
        div.load(this.href, 'section_only=1');
        return false;
    });
}

function toggle_visibility(id) {
    var tog = $("#"+id);
    tog.toggle();
    return false;
}

function refreshMinichat(){
        parent.mini_chat.location="mini_chat.php";
}


// Keep in mind the need to use window.parent when in iframe.
function updateHealthBar(health){
    // Should only update when a change occurs.
    var mess = '| '+health+' health';
    var span = $('#logged-in-bar-health', top.document);
    span.text(mess);
    if(health<100){
        span.css({'color' : 'red'});
    } else {
        span.css({'color' : ''});
    }
}

// For refreshing quickstats from inside main.
function refreshQuickstats(quickView){
    // Accounts for ajax section.
    var url = 'quickstats.php?command='+quickView;
    if(top.window.NW.firstLoad > 1){
        if(top.window.NW.quickDiv){
            top.window.NW.quickDiv.load(url, 'section_only=1');
        } else {
            // Use parent to indicate the parent global variable.
    	    parent.quickstats.location=url;
        }
    }
    top.windown.NW.firstLoad++;
}


// Initial load of everything, run at the bottom to allow everything else to be defined beforehand.
$(document).ready(function() {
   
    // INDEX ONLY CHANGES 
    if(window.location.pathname.substr(-9,9) == 'index.php'){    
        updateIndex();
        

       /* Collapse the following parts of the index */
        $("#links-menu").toggle();
        
        /* Expand the chat when it's clicked. */
        $("#expand-chat").click(function () {
            $("#mini-chat-frame-container").removeClass('chat-collapsed').addClass('chat-expanded');/*.height(780);*/
            $(this).hide();  // Hide the clicked section after expansion.
        });
        
        
        var quickstatsLinks = $("a[target='quickstats']");
        quickstatsLinks.css({'font-style':'italic'}); // Hide all links using target as a test.
        var quickDiv =  $('div#quickstats-frame-container');
        //quickDiv.load('quickstats.php');
        // Add the click handlers for loading the quickstats frame.
        frameClickHandlers(quickstatsLinks, quickDiv);
        NW.quickDiv = quickDiv;
        
        /*
        miniChatLinks = $("a[target='mini_chat']");
        miniChatLinks.css({'font-style':'italic'}); // Hide all links using target as a test.
        chatDiv = $('div#mini-chat-frame-container');
        
        frameClickHandlers(miniChatLinks, chatDiv);
        
        mainLinks = $("a[target='main']");
        mainLinks.css({'font-style':'italic'}); // Hide all links using target as a test.
        mainDiv = $('div#main-frame-container');
        mainDiv.hide();
        // The mainDiv handler would want to refresh quickstats when it loads if it's
        // footer gets excluded.
        */
        
        
        chainedTimeout(); // Start the periodic index update.
    }    
    
    /* THIS CODE RUNS FOR ALL SUBPAGES */
    // TODO: Analyse whether it's good for this code to run in auto-loaded subpages in iframes, e.g. chat, quickstats.
        
    // GOOGLE ANALYTICS
    /* Original suggested header include, I made it nw specific with
    // http://www and just included the file directly <script type="text/javascript">
    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    doscument.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
    </script> */
    try {
    var pageTracker = _gat._getTracker("UA-707264-2");
    pageTracker._trackPageview();
    } catch(err) {}

   
 });
