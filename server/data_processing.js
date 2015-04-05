// Functions and variables to process data and load them into Meteor/MongoDB Collections go here

// Meteor.methods({
//     "processJobData": processJobData,
// });

// function processJobData(jsonfile){

	

    // // Using collectionFS package
    // CSV().from.string(jsonfile)
    // // Need to bind Meteor environment to callbacks in other libraries
    // .to.array(Meteor.bindEnvironment(function(data){

    //     var dataset = {
    //         "user_id": Meteor.userId(),
    //         "name": name,
    //         "rowCount": data.length - 1, // subtract the header row
    //         "questions": []
    //     };

    //     // Add to database or replace existing with same name
    //     var d_id = Datasets.insert(dataset);
    //     console.log("Added dataset ", name);

    //     // Convert rows to columns
    //     var cols = _.zip.apply(_, data);
    //     // Convert arrays to objects, separate name from values
    //     _.each(cols, function(v,i,a){
    //         a[i] = {
    //             "user_id": Meteor.userId(),
    //             name: v[0],
    //             values: [],
    //             "orig_values": _.rest(v),
    //             "dataset_id": d_id
    //         };
    //     });
        
    //     // Detect the datatype
    //     _.each(cols, function(col) {
    //         var datatype = detectDataType(col.orig_values);
    //         col["datatype"] = datatype[0];
    //         col["datatypeIdx"] = DATATYPE_SORT_IDX[datatype[0]];

    //         // Cast numbers and dates before storing
    //         if (datatype[0] == "float"){
    //             col = processFloat(col);

    //         } else if (datatype[0] == "integer") {
    //             col = processInt(col);

    //         } else if (datatype[0] == "string") {
    //             col = processString(col);

    //         } else if (datatype[0] == "date") {
    //             col = processDate(col);

    //         } else if (datatype[0] == "time") {
    //             col = processTime(col);
    //         }

    //         col.notes = null;

    //         Columns.insert(col);
    //     });


    // }));
// }