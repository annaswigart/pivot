Jobs = new Mongo.Collection('jobs');
Careers = new Mongo.Collection('careers');
Skills = new Mongo.Collection('skills');

// ClientQuery = new Mongo.Collection('clientQuery');
// CareersFiltered = new Mongo.Collection('careersFiltered');

// Use lodash instead of underscore
_ = lodash;

if (Meteor.isServer){

    Meteor.publish('jobs', function(){
        return Jobs.find({}, {fields: {job_id: 1, skills: 1} });
    });

    Meteor.publish('careers', function(options, searchString){
    	console.log(searchString + " is searchString");
    	// Careers.createIndex(
     //                       {
     //                         standardized_title: "text",
     //                         skills: {name: "text"},
     //                         job_titles: {name: "text"},
     //                         companies: {name: "text"},
     //                         categories: {name: "text"},
     //                       }
     //                     )
    	// Careers.createIndex({ "$**": "text" }, { name: "TextIndex" });
    	return Careers.find(
    			{standardized_title : { $regex : searchString}},
    			options);
		    		
		    		//{ '$regex' : '/html/', '$options' : 'i' }});

    	console.log(searchString + " query done");

    });

 //    Meteor.publish('careersFiltered', function(options, searchString){
 //    	console.log(searchString + " is searchString");
 //    	return Mongo.Collection._publishCursor( Careers.find({}, options, {sort: {num_ids: -1}}, 
 //    		{ $text: { $search: {skills: searchString}}}), 
 //    	this, 'careersFiltered'); 
 //    	console.log(searchString + " query done");
 //    	this.ready();
	// });

	Meteor.publish('clientQuery', function() {
		return ClientQuery.find();
	})

    Meteor.publish('skills', function(){
        return Skills.find({});
    });

    Careers.allow({
        insert: function(){
            return true;
        }
    });

    Jobs.allow({
    	insert: function() {
    		return true;
    	}
    });

    Skills.allow({
    	insert: function() {
    		return true;
    	},
    	update: function(){
            return true;
        }
    });

    // CareersFiltered.allow({
    // 	insert: function() {
    // 		return true;
    // 	},
    // 	update: function(){
    //         return true;
    //     },
    //     remove: function(){
    //     	return true;
    //     }
    // });


    Meteor.startup(function () {
        Meteor.call('processJobData');
    });	
}	

Meteor.methods({
    "processJobData": processJobData,
});

function processJobData() {
	if (Jobs.find({}).count() == 0) {
			// DATA FOR JOBS COLLECTION
	        var jobs = JSON.parse(Assets.getText('data/jobs_data.json'));
	        // TRANSFORMED DATA FOR CAREERS COLLECTION
	        var careers = _.chain(jobs)
	            .groupBy('standardized_title')
	            .map(function(value, key) {
	                return {
	                    standardized_title: key,
	                    skills: _.chain(_.flatten(_.pluck(value, "skills")))
		                                .groupBy(function(skill) { return skill; })
		                                .map(function(value, key) {
		                                    var sum = _.reduce(value, function(memo, val) { return memo + 1; }, 0);
		                                    return {name: key, count: sum};
		                                })
		                                .sortBy(function(item) {return -item.count;})
		                                .value(),

	                    categories: _.chain(_.flatten(_.pluck(value, "categories")))
										.groupBy(function(cat) { return cat; })
		                                .map(function(value, key) {
		                                    var sum = _.reduce(value, function(memo, val) { return memo + 1; }, 0);
		                                    if (key != null) {
		                                    	return {name: key, count: sum};
		                                    }
		                                })
		                                .sortBy(function(item) {return -item.count;})
		                                .value(),

		                companies: _.chain(_.flatten(_.pluck(value, "company")))
										.groupBy(function(company) { return company; })
		                                .map(function(value, key) {
		                                    var sum = _.reduce(value, function(memo, val) { return memo + 1; }, 0);
		                                    if (key != null) {
		                                    	return {name: key, count: sum};
		                                    }
		                                })
		                                .sortBy(function(item) {return -item.count;})
		                                .value(),

	                    job_titles: _.chain(_.flatten(_.pluck(value, "title")))
										.groupBy(function(title) { return title; })
		                                .map(function(value, key) {
		                                    var sum = _.reduce(value, function(memo, val) { return memo + 1; }, 0);
		                                    if (key != null) {
		                                    	return {name: key, count: sum};
		                                    }
		                                })
		                                .sortBy(function(item) {return -item.count;})
		                                .value(),

	                    job_ids: _.flatten(_.pluck(value, "job_id")),
	                    num_ids: _.flatten(_.pluck(value, "job_id")).length,
	
	                }
	            })
	            .value();

	    // FUNCTIONS AND TRANSFORMED DATA FOR SKILLS COLLECTION
        var getJobSkillCount = function (targetSkill) {
            var numTimesSeen = 0;
            _.each(jobs, function(job) {
                if(_.contains(job.skills, targetSkill)) {
                    numTimesSeen += 1;
                }
            });
            return numTimesSeen;
        }

        var getCareersWithSkill = function (targetSkill) {
            var career_ids = [];
            _.each(careers, function(career) {

                if(_.contains((_.pluck(career.skills, "name")), targetSkill)) {
                    career_ids.push(career._id);
                }
            });
            return career_ids;
        }

        var getRelatedSkills = function (targetSkill){

            var others = [];
            var related = [];

            // get array of all skills that co-occur with target
            _.each(jobs, function(job) {
                if(_.contains(job.skills, targetSkill)) {
                    others = _.without(job.skills, targetSkill)
                    related.push(others);
                }
                
            });

            // flatten array, map by related skill, reduce by count, and sort by count 
            var relatedSkills = _.chain(related)
                                .flatten()
                                .groupBy(function(skill) { return skill; })
                                .map(function(value, key) {
                                    var sum = _.reduce(value, function(memo, val) { return memo + 1; }, 0);
                                    return {name: key, count: sum};
                                })
                                .sortBy(function(item) {return -item.count;})
                                .value();

            return relatedSkills;
        }

        var uniqueSkills =  _.uniq(_.flatten(_.pluck(jobs, 'skills')));

        var skills = _.map(uniqueSkills, function(skill) {
                            return {
                                name: skill,
                                related: getRelatedSkills(skill),
                                countJobs: getJobSkillCount(skill),
                            }
        }); 

        // INSERT DATA INTO COLLECTIONS

        _.each(jobs, function(job) {
        	Jobs.insert(job);
        });

        _.each(careers, function(career) {
        	Careers.insert(career);
        });  

        _.each(skills, function(skill) {
        	Skills.insert(skill);
        	Skills.update( {"name": skill}, {"career_ids": getCareersWithSkill(skill)} ) // Does not work?	                               
        });

        console.log('Done importing data!');
	}
}
