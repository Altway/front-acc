
/**
 * Simple function to wrap http calls
 * @param url
 * @param [method] method for the http request
 * @param [headers] header of the http request
 * @param [body] body of the http request
 */
export async function GET(url, headers = {"Content-type": "application/json"}) {
  if (url) {
    const requestOptions = {
      method: "GET",
      headers: headers,
    }
    let response = await fetch(url, requestOptions).then(r => r.json());
    return response
  }
}

export async function POST(url, headers = {"Content-type": "application/json"}, body = {}) {
  if (url) {
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    }
    let response = await fetch(url, requestOptions).then(r => r.json());
    return response
  }
}

export async function DELETE(url, headers = {"Content-type": "application/json"}, body = {}) {
  if (url) {
    const requestOptions = {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(body)
    }
    let response = await fetch(url, requestOptions).then(r => r.json());
    return response
  }
}

export async function PATCH(url, headers = {"Content-type": "application/json"}, body = {}) {
  if (url) {
    const requestOptions = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(body)
    }
    let response = await fetch(url, requestOptions).then(r => r.json());
    return response
  }
}

export async function PUT(url, headers = {"Content-type": "application/json"}, body = {}) {
  if (url) {
    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body)
    }
    let response = await fetch(url, requestOptions).then(r => r.json());
    return response
  }
}