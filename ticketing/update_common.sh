projects=( "auth" "tickets" "orders" )

for project in "${projects[@]}"
do
  cd $project
  npm install "@drptickets/common@latest"
  cd ..
done
