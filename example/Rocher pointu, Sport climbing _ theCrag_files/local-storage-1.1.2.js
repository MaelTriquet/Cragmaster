var localStorageEnabled = undefined

var tcLocalStorageObjectPrefixKey = '/object';

var tcLocalStorageMemorizePrefixKey = '/memorize';

function tcUncachedIsLocalStorageAvailable() {
  try {
    var value = 'test';
    var key = '__availability-key';
    localStorage.setItem(key, value);
    var recoveredValue = localStorage.getItem(key);
    localStorage.removeItem(key);

    return recoveredValue === value;
  } catch(e) {
    return false;
  }
}

function tcIsLocalStorageAvailable() {
  if (localStorageEnabled === undefined) {
    localStorageEnabled = tcUncachedIsLocalStorageAvailable();
  }
  return localStorageEnabled;
}

function tcSetLocalStorageObject(key,data) {
  if (!tcIsLocalStorageAvailable()) {
    return;
  }
  
  var objectKey = tcLocalStorageObjectPrefixKey + key;
  var dataStr = JSON.stringify(data);

  localStorage.setItem(objectKey, dataStr);
}

function tcRemoveLocalStorageObject(key) {
  if (!tcIsLocalStorageAvailable()) {
    return;
  }

  var objectKey = tcLocalStorageObjectPrefixKey + key;

  localStorage.removeItem(objectKey);
}

function tcGetLocalStorageObject(key) {
  if (!tcIsLocalStorageAvailable()) {
    return null;
  }

  var objectKey = tcLocalStorageObjectPrefixKey + key;
  var dataStr = localStorage.getItem(objectKey);

  if (!dataStr) {
    return null;
  }

  return JSON.parse(dataStr);
}

function tcSetLocalStorageMemorize(key,data,ttl) {
  var memorizeKey = tcLocalStorageMemorizePrefixKey + key;

  var now = new Date();
  var item = {
    data: data,
    expiry: now.getTime() + ttl,
  };

  tcSetLocalStorageObject(memorizeKey,item);
}

function tcGetLocalStorageMemorizeObject(key) {
  var memorizeKey = tcLocalStorageMemorizePrefixKey + key;

  let item = tcGetLocalStorageObject(memorizeKey);

  if (!item) {
    return null;
  }

  var now = new Date();

  if (now.getTime() > item.expiry) {
    tcRemoveLocalStorageObject(memorizeKey);
    return null;
  }

  return item.data;
}
