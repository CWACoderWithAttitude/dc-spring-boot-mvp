#!/bin/sh

xml_file=~/tmp/namp.xml
xml_file=~/tmp/nnmp_sn.xml
#nmap -sn 192.168.178.0/24 -oX $xml_file
#cat $xml_file | xq -j | jq '.nmaprun.host[] | .address."@addr" + " ; " + .hostnames.hostname."@name" + " ; " + .status."@state"'
xml_file=~/tmp/namp_t4_f.xml 

#sudo nmap -T4 -F 192.168.178.0/24 -oX $xml_file 
#cat $xml_file | xq -j | jq '.nmaprun.host[] | .address."@addr" + " ; " + .hostnames.hostname."@name" + " ; " + .status."@state"'
#cat $xml_file | xq -j | jq -r '.nmaprun.host[] | [    (.address[] | select(."@addrtype" == "ipv4").@addr),    (.address[] | select(."@addrtype" == "mac").@addr // "N/A"),    (.address[] | select(."@addrtype" == "mac").@vendor // "N/A"), (.hostnames.hostname."@name" // "N/A"), ([.ports.port // [] | if type == "array" then .[] else . end | select(."state"."@state" == "open")."@portid"] | join(", "))] @tsv' 
#cat $xml_file | xq -j | jq -r '.nmaprun.host[]'	|  .address[] | select(."@addrtype" == "ipv4").i"@addr"' #,    (.address[] | select(."@addrtype" == "mac").@addr ) ' #,    (.address[] | select(."@addrtype" == "mac").@vendor // "N/A"), (.hostnames.hostname."@name" // "N/A"), ([.ports.port // [] | if type == "array" then .[] else . end | select(."state"."@state" == "open")."@portid"] | join(", "))] @tsv' 


#cat ~/tmp/namp_t4_f.json| jq -r '.nmaprun.host[1] | .address[] |  ."@addrtype" '
#cat ~/tmp/namp_t4_f.json| jq -r '.nmaprun.host[] | .address[] | select (."@addrtype"=="mac")."@addr" '
#cat ~/tmp/namp_t4_f.json| jq -r '.nmaprun.host[] | .address[] | select(."@addrtype") |select (."@addrtype"=="mac")."@addr" '
cat ~/tmp/namp_t4_f.json| jq -r '.nmaprun.host[] | .address[] | select (."@addrtype"=="ipv4")."@addr" '


