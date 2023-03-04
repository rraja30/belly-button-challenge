// initialize a function to create a dropdown menu
function make_dropdown(){
    //read in the data from samples.json
    d3.json("samples.json").then((data) => {
        let names = data.names;
        names.forEach((name) => {
          selector
            .append("option")
            .text(name)
            .property("value", name);
        });
        buildMetadata(names[0]);
        buildCharts(names[0]);
        console.log(names[0])
    });
}
function optionChanged(selectedID){
      buildMetadata(selectedID);
      buildCharts(selectedID);
  
  }
// funciton to create metadata
function buildMetadata(id){

    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        let resultArray = metadata.filter(Obj => Obj.id == id);
        let result = resultArray[0];
        let box = d3.select("#sample-metadata");
        box.html("");
        Object.entries(result).forEach(([key, value]) => {
            box.append("h6").text(`${key.toUpperCase()}: ${value}`);
          });
    })

}
// funciton to build charts
function buildCharts(selectedID) {
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(Obj => Obj.id == selectedID);
        let result = resultArray[0];
        console.log(result)
        let metadata = data.metadata;
        let metaArray = metadata.filter(Obj => Obj.id == selectedID);
        let metaResult = metaArray[0];
        let wfreq = metaResult.wfreq;
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        // making bar chart 
        // make place for bar chart data
        let dataBar = [
            { y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",}
          ];
          //specifying the layout of the bar chart
          let layoutBar = {
            title: "Top 10 Bacterial Cultures Found",
            margin: { t: 30, l: 150 },
          };
          //making the bar plot 
          Plotly.newPlot("bar", dataBar, layoutBar);
          //making bubble chart
         // make place for bubble chart data
          let dataBubble = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
              }
            }
          ];
           //specifying the layout of the bubble chart
           let layoutBubble = {
            title: "Bacterial Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30}
          };
          //making the bubble plot
          Plotly.newPlot("bubble", dataBubble, layoutBubble);
          //making gauge chart
          //making place for gauge chart data 
          let dataGauge = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "# Scrubs Per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 10] },
                steps: [
                  { range: [0, 2], color: "#blue" },
                  { range: [2, 4], color: "#green" },
                  { range: [4, 6], color: "#yellow" },
                  { range: [6, 8], color: "#orange" },
                  { range: [8, 10], color: "#red" }
                ],
              }
            }
          ];
          let layoutGauge = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    })
}
// initialise dropdown
function initialize(){
    var selector = d3.select("#selDataset");
    make_dropdown()
}

init()