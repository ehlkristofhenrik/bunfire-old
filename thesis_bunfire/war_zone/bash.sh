#!/bin/bash

# AI firewall
function firewall() {
    # Could be done using Bun.env['BASH_COMMAND'] but its more flexible this way
    ./bunfire $BASH_COMMAND
    if [ $? -le 6 ]; then
        echo "You shall not pass!"
        exit
    fi
}

# firewall can not be altered
readonly -f firewall

enable -n readonly
trap firewall DEBUG
enable -n trap enable
