Ludum Dare 49 - Unstable
------------------------

Space Game Version

Synposis:
You are having a reactor issue in the midst of an asteroid field. Time to get the heck out! But you have to manage your unstable reactor as you dodge asteroids! Multi-tasking!

Running it
----------

docker-compose up

Dev Notes:
----------

1. Build script doesn't refresh changes to index.html, so you have to restart it or manually copy it to dist/ if you change it
2. Since gokart.js is very alpha, and i am dogfooding it, it is set up as a submodule. After you install everything:

  cd node_modules/
  rm -rf gokart.js
  ln -s ../gokart.js

