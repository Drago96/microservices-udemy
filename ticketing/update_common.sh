projects=( "auth" "tickets" "orders" "expiration" )

for project in "${projects[@]}"
do
  cd $project
  npm install "@drptickets/common@latest"
  cd ..
done
