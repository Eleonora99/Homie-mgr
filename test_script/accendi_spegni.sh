curl -X POST -i  'https://homie-mgr.xyz:4786/change_status' -d "device_id=100123245a&azione=on"
sleep 2
curl -X POST -i  'https://homie-mgr.xyz:4786/change_status' -d "device_id=100123245a&azione=off"
