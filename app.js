// const getDaysRange = (days) => {
//   let d = new Date()

//   let from_d = new Date(d.getTime() - (days * 24 * 60 * 60 * 1000))

//   let to_date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`

//   let from_date = `${from_d.getFullYear()}-${from_d.getMonth() + 1}-${from_d.getDate()}`

//   return {
//     start_date: from_date,
//     end_date: to_date
//   }
// }

const getSettings = (country, status) => {
  // let date = getDaysRange(30)

  // let url = `https://api.covid19api.com/country/japan/status/confirmed?from=${date.start_date}&to=${date.end_date}`
  let url = `https://api.covid19api.com/dayone/country/${country}/status/${status}`

  const settings = {
    async: true,
    crossDomain: true,
    url:
      `${url}`,
    method: "GET",
    dataType: "json",
  };
  return settings
}

const getData = (country, countryId) => {

  //新規感染者数取得
  let settings = getSettings(countryId, 'confirmed')
  $.ajax(settings).done((response) => {
    console.log(response);
    const layout = {
      title: {
        text: `${country}`,
        font: {
          // family: 'Courier New, monospace',
          size: 24
        }
      }
    }

    let cases = [0]

    for (let i = 1; i < response.length; i++) {
      cases.push(response[i]['Cases'] - response[i - 1]['Cases']);
    }

    let date = []
    response.forEach(element => {
      date.push(element['Date'].substring(0, 10))
    });
    // console.log(cases);
    // console.log(date);

    Plotly.plot("chart", [
      {
        x: date,
        y: cases,
        name: "Comfirmed",
        mode: "line",
        type: "scatter",
        line: {
          color: "blue",
        }
      }
    ], layout);
  })

  //死亡者数取得
  settings = getSettings(country, 'deaths')
  $.ajax(settings).done((response) => {
    console.log(response);
    const layout = {
      title: {
        text: `${country}`,
        font: {
          // family: 'Courier New, monospace',
          size: 24
        }
      }
    }

    let cases = [0]

    for (let i = 1; i < response.length; i++) {
      cases.push(response[i]['Cases'] - response[i - 1]['Cases']);
    }

    let date = []
    response.forEach(element => {
      date.push(element['Date'].substring(0, 10))
    });
    // console.log(cases);
    // console.log(date);

    Plotly.plot("chart", [
      {
        x: date,
        y: cases,
        name: "Deaths",
        mode: "line",
        type: "scatter",
        line: {
          color: "red",
        }
      }
    ], layout);
  })
}

getData('Japan', 'japan');

//country list取得
const settings = {
  async: true,
  crossDomain: true,
  url:
    'https://api.covid19api.com/countries',
  method: "GET",
  dataType: "json",
};

$.ajax(settings).done((response) => {
  // console.log(response);
  response.forEach((e) => {
    $('#countryList').append(`<option value=${e['Slug']}>${e['Country']}</option>`)
    $("#countryList option[value='japan']").prop('selected', true);
  })
})

//国を変更したときに再度感染者データ取得
$('#countryList').change(function () {
  const country = $('option:selected').text();
  const countryId = $('option:selected').val();

  while ($('#chart')[0]['data'].length) {
    Plotly.deleteTraces('chart', [0], "");
  }

  getData(country, countryId);

  console.log($('#chart'));
})