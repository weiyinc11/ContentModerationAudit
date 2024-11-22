#!/bin/bash
#!/bin/bash node 
#!/bin/bash python3

cd "$(dirname "$0")"
SCRIPT_DIR="$(pwd)"

cd ..
SCRIPT_DIR_BF="$(pwd)"

PATH_BOT1="$SCRIPT_DIR_BF/bot1.js"
PATH_BOT2="$SCRIPT_DIR_BF/bot2.js"
DATA_BOT="$SCRIPT_DIR_BF/data.py"

argsBot1=()
argsBot2=()
count=0
for arg in "$@"; do
    for arg_t in $arg; do
        if [ "$count" -eq 0 ]; then
            argsBot1+=($arg_t)
        else
            argsBot2+=($arg_t)
        fi
    done 
    count+=1
done

node $PATH_BOT1 ${argsBot1[@]} & node $PATH_BOT2 ${argsBot2[@]} & python3 $DATA_BOT
