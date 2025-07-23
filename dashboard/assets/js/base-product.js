document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("templateForm");
  const templateList = document.getElementById("templateList");

  const templates = JSON.parse(localStorage.getItem("productTemplates")) || [];

  function renderTemplates() {
    templateList.innerHTML = "";
    templates.forEach((template) => {
      const div = document.createElement("div");
      div.className = "template-card";
      div.innerHTML = `
        <h3>${template.name}</h3>
        <p><strong>Description:</strong> ${template.description}</p>
        <p><strong>Sizes:</strong> ${template.sizes.join(", ")}</p>
        <p><strong>Colors:</strong> ${template.colors.join(", ")}</p>
        <p><strong>Category:</strong> ${template.category}</p>
        ${
          template.image
            ? `<img src="${template.image}" alt="Template Image" />`
            : ""
        }
      `;
      templateList.appendChild(div);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("templateName").value;
    const description = document.getElementById("templateDescription").value;
    const sizes = document
      .getElementById("templateSizes")
      .value.split(",")
      .map((s) => s.trim());
    const colors = document
      .getElementById("templateColors")
      .value.split(",")
      .map((c) => c.trim());
    const category = document.getElementById("templateCategory").value;
    const imageFile = document.getElementById("templateImage").files[0];

    const reader = new FileReader();
    reader.onload = function () {
      const imageBase64 = reader.result;

      const newTemplate = {
        name,
        description,
        sizes,
        colors,
        category,
        image: imageBase64,
      };

      templates.push(newTemplate);
      localStorage.setItem("productTemplates", JSON.stringify(templates));
      renderTemplates();
      form.reset();
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      const newTemplate = {
        name,
        description,
        sizes,
        colors,
        category,
        image: null,
      };
      templates.push(newTemplate);
      localStorage.setItem("productTemplates", JSON.stringify(templates));
      renderTemplates();
      form.reset();
    }
  });

  renderTemplates();
});
