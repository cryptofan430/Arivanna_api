const handler = require("../handler");
const db = require('../../lib/database/query');

module.exports.getDocumentsByEmployeeIdHandler = async (event) => {
  // get the employee id from the event 
  const employee_id = event.pathParameters.id;

  try {
    // get documents url name and id from database
    const employee_document_url_names = await db.custom(`
      SELECT 
          name, id_employee_document_url_name, required_for_apply, required_for_onboard, company_provided
      FROM
          employee_document_url_names
      WHERE
          active = TRUE and company_provided != 1;
    `);

    // get documents from database
    const employee_document_urls = await db.custom(`
      SELECT 
          id_employee_document_url_name,
          id_employee_document_url,
          url,
          active AS employee_document_url_active,
          id_employee,
          approved,
          notes
      FROM
          employee_document_urls
      WHERE
          id_employee = '${employee_id}'
              AND employee_document_urls.active = 1;
      `);



    let merged = employee_document_url_names.map(function (item) {
      return {
        ...item,
        ...employee_document_urls.find(x => x.id_employee_document_url_name === item.id_employee_document_url_name)
      };
    });

    // const documents = merged;
    merged.forEach(document => {
      document["uploaded"] = document.employee_document_url_active ? "True" : "False";
    });

    // for (let i = 0; i < documents.length; i += 1) {
    //   if (!documents[i].employee_document_url_active) {
    //     documents[i].uploaded = "False";
    //   } else {
    //     documents[i].uploaded = "True";
    //   }
    //   if (documents[i].approved == 0) {
    //     documents[i].uploaded = "False";
    //   } else {
    //     documents[i].uploaded = "True";
    //   }

    //   if (data.length == 0) {
    //     data.push(documents[i]);
    //   } else {
    //     let indexOfExistDocument = data.findIndex(dataItem =>
    //       dataItem.id_employee == documents[i].id_employee &&
    //       dataItem.id_employee_document_url_name == documents[i].id_employee_document_url_name
    //     );
    //     if (indexOfExistDocument >= 0) {
    //       data.splice(indexOfExistDocument, 1, documents[i]);
    //     } else {
    //       data.push(documents[i]);
    //     }
    //   }
    // }
    //console.log(merged)
    return handler.returner([true, merged], 'Get the documents of employee successfully!', 200);
  } catch (error) {
    console.log(error);
    return handler.returner([false, ''], 'Internal server error.', 500);
  }
};

module.exports.getSpecificCompanyProvidedDocumentsByEmployeeIdHandler = async (event) => {
  // get the employee id from the event 
  const employee_id = event.pathParameters.id;

  try {
    // get documents url name and id from database
    const employee_document_url_names = await db.custom(`
      SELECT 
        name, id_employee_document_url_name, required_for_apply, required_for_onboard, company_provided
      FROM
          employee_document_url_names
      WHERE
          active = TRUE
      AND 
          company_provided = 1;
    `);

    // get documents from database
    const employee_document_urls = await db.custom(`
      SELECT 
          id_employee_document_url_name,
          id_employee_document_url,
          url,
          active AS employee_document_url_active,
          id_employee,
          approved,
          notes
      FROM
          employee_document_urls
      WHERE
          id_employee = '${employee_id}'
              AND employee_document_urls.active = 1;
      `);


    /*
          let merged = [];
    
          for (let i = 0; i < employee_document_url_names.length; i++) {
            merged.push({
              ...employee_document_url_names[i],
              ...(employee_document_urls.find((itmInner) => itmInner.id_employee_document_url_name == employee_document_url_names[i].id_employee_document_url_name))
            }
            );
          }
      */





    let merged = employee_document_url_names.map(function (item) {
      return {
        ...item,
        ...employee_document_urls.find(x => x.id_employee_document_url_name === item.id_employee_document_url_name)
      };
    });
    // // for (let i = 0; i < document_names.length; i++) {
    // //   merged.push({
    // //     ...document_names[i],
    // //     ...(active_documents.find((itmInner) => itmInner.id_employee_document_url_name == document_names[i].id_employee_document_url_name))
    // //   });
    // // }

    // const documents = merged;
    merged.forEach(document => {
      document["uploaded"] = document.employee_document_url_active ? "True" : "False";
    });

    // for (let i = 0; i < documents.length; i += 1) {
    //   if (!documents[i].employee_document_url_active) {
    //     documents[i].uploaded = "False";
    //   } else {
    //     documents[i].uploaded = "True";
    //   }
    //   if (documents[i].approved == 0) {
    //     documents[i].uploaded = "False";
    //   } else {
    //     documents[i].uploaded = "True";
    //   }

    //   if (data.length == 0) {
    //     data.push(documents[i]);
    //   } else {
    //     let indexOfExistDocument = data.findIndex(dataItem =>
    //       dataItem.id_employee == documents[i].id_employee &&
    //       dataItem.id_employee_document_url_name == documents[i].id_employee_document_url_name
    //     );
    //     if (indexOfExistDocument >= 0) {
    //       data.splice(indexOfExistDocument, 1, documents[i]);
    //     } else {
    //       data.push(documents[i]);
    //     }
    //   }
    // }


    return handler.returner([true, merged], 'Get the documents of employee successfully!', 200);
  } catch (error) {
    console.log(error);
    return handler.returner([false, ''], 'Internal server error.', 500);
  }
};

module.exports.changeApprovedByEmployeeDocumentUrlIdHandler = async (event) => {
  const id_employee_document_url = event.pathParameters.id;
  const { approved } = JSON.parse(event.body);
  try {
    const resData = await db.update_one('employee_document_urls', { approved }, 'id_employee_document_url', id_employee_document_url);
    console.log('resData', resData);
    return handler.returner([true, resData], 'Get the documents of employee successfully!', 200);
  } catch (error) {
    console.log(error);
    return handler.returner([false, ''], 'Internal server error.', 500);
  }
};
