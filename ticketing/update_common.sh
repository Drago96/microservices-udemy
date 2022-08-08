projects=( "auth" "tickets" )

for project in "${projects[@]}"
do
  cd $project
  npm update "@drptickets/common"
  cd ..
done
