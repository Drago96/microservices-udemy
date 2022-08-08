projects=( "auth" "tickets" )

for project in "${projects[@]}"
do
  cd $project
  npm install "@drptickets/common@latest"
  cd ..
done
