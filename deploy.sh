#!/bin/bash
USER=$1
IP=$2
if [[ $USER == "" ]]; then
    USER="pi"
fi
if [[ $IP == "" ]]; then
    IP="192.168.100.59"
fi
echo "$USER@$IP"
if [[ ! -d deploy ]]; then
    mkdir deploy
fi
cp app/build/libs/*.jar deploy/
cp config.properties deploy/
cp run deploy/
#cp kiosk deploy/

rsync -iaL --exclude=private/ resources/ deploy/resources/
rsync -ia --delete app/lib/ deploy/lib/
LOG=log/
if [[ -f "$LOG" ]]; then
  rsync -ia --info=progress --exclude=log/ deploy/ $USER@$IP:atn/
else
  rsync -ia --info=progress deploy/ $USER@$IP:atn/
fi
