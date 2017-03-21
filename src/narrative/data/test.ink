VAR player_online = 1

-> start

== start ==

Welcome...

-> hello


== hello ==

~ player_online = 0

Hello world!
How are you today?

- (opts)
    <-  debug(-> opts)
    *   Hello back! -> DONE


== debug(-> next) ==
# debug

player_online = {player_online}

+   { not player_online } [DEBUG set player_online = 1]
    ~ player_online = 1
+   { player_online } [DEBUG set player_online = 0]
    ~ player_online = 0
-   -> next
