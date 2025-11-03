const trainBtn = document.getElementById("trainBtn");
const input = document.getElementById("svgbox");
const svgName = document.getElementById("svgname");
const svg = document.querySelector(".size-6");

(async () => {
  const model = localStorage.getItem("tensorflowjs_models/my-model/info")
    ? await tf
        .loadLayersModel("localstorage://my-model")
        .then((m) => m)
        .catch((err) => {
          console.error("Error loading model:", err);
        })
    : (() => {
        let m = tf.sequential();
        m.add(
          tf.layers.dense({ units: 128, inputShape: [50], activation: "relu" })
        ); // Hidden layer
        m.add(tf.layers.dense({ units: 50 }));

        return m;
      })();

  var xs, ys;

  model.compile({
    loss: tf.losses.meanSquaredError,
    optimizer: tf.train.adam(0.001), // Adam often works better than SGD
  });

  function stringToFixedCodeArray(str, length = 50) {
    const codes = str.split("").map((c) => c.charCodeAt(0));
    while (codes.length < length) codes.push(0);
    return codes.slice(0, length);
  }

  function fixedCodeArrayToString(arr) {
    console.log(
      "Fixed Code Array:",
      arr.filter((code) => code !== 0).map((code) => Math.round(Math.abs(code)))
    );

    return arr
      .filter((code) => code !== 0)
      .map((code) => String.fromCharCode(Math.round(Math.abs(code))))
      .join("");
  }

  svgName.addEventListener("input", async (e) => {
    // Prepare the input tensor based on the SVG name
    const inputValue = stringToFixedCodeArray(e.target.value.trim());
    console.log("Input Value:", inputValue);

    xs = tf.tensor2d([inputValue], [1, 50]);
  });

  input.addEventListener("input", async (e) => {
    const template = document.createElement("template");
    template.innerHTML = e.target.value.trim();

    console.log(template.content.firstElementChild.firstElementChild);
    const val = template.content.firstElementChild.firstElementChild
      .getAttribute("d")
      .trim();
    console.log(val);

    const outputArr = stringToFixedCodeArray(val);
    console.log("Output Array:", outputArr);

    // Prepare the output tensor
    ys = tf.tensor2d([outputArr], [1, 50]);
  });

  // Train the model btn click
  trainBtn.addEventListener("click", () => {
    console.log("Training started");
    xs.print();
    ys.print();
    model
      .fit(xs, ys, {
        epochs: 200,
        validationSplit: 0.2, // Use 20% for validation
        callbacks: {
          onEpochEnd: (epoch) => {
            gola.style.strokeDashoffset = 440 - (440 * epoch) / 100;
            ppc.textContent = epoch + "%";
          },
        },
      })
      .then(async () => {
        await model.save("localstorage://my-model");
        console.log("Training complete");
      });
  });

  const predict = async (inputValue) => {
    const inputTensor = tf.tensor2d(
      [stringToFixedCodeArray(inputValue)],
      [1, 50]
    );
    const prediction = model.predict(inputTensor);
    const outputArray = await prediction.data();
    console.log("Prediction Output Array:", outputArray);
    const outputString = fixedCodeArrayToString(outputArray);

    console.log("Prediction:", outputString);

    svg.firstElementChild.setAttribute("d", outputString);
  };

  svg.addEventListener("click", () => predict("plus"));
})();
