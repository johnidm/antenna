# Discoveries

I am happy to share my journey building a Radio Studio App.

The idea is build a web app that can stream radio stations around the world.

Of course, I will use AI to help me build this app.

In this phase, I will search similar app on internet.

I type some keywords on google and find the following links:

- https://radiomc.vercel.app/
- https://radio.garden/ (I already use it)
- https://app.radiooooo.com/ (I already know)
- https://globeradio.app/
- https://github.com/jonasrmichel/radio-garden-openapi
- https://www.radio-browser.info/

The result: 

On Globe Radio, I found a two urls with radio stations around the world.
- https://globetv.app/assets/locales/eng.json
- https://globeradio.app/api/get_stations_by_country.php?country=BR

In this site I found a json file with radio stations.
- https://radiomc.vercel.app/radios.json

On Radio Browser, I found full datebase with a curated list of radio stations.

```
curl "https://de1.api.radio-browser.info/json/stations?limit=100000&hidebroken=true" -o stations-100k.json
```
