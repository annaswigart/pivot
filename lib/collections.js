Jobs = new Mongo.Collection('jobs');
Careers = new Mongo.Collection('careers');
Skills = new Mongo.Collection('skills');


// Use lodash instead of underscore
_ = lodash;

if (Meteor.isServer){

    Meteor.publish('jobs', function(){
        return Jobs.find({}, {fields: {job_id: 1, skills: 1} });
    });

    Meteor.publish('careerResults', function(options, searchString){

        sub = this;

        // var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

        results =  Careers.aggregate([
                            {$match: 
                                {$or: [
                                    {standardized_title : { $regex : searchString, $options : 'i'}},
                                        {'job_titles.name' : { $regex : searchString, $options : 'i'}},
                                        {'categories.name' : { $regex : searchString, $options : 'i'}},
                                        {'skills.name' : { $regex : searchString, $options : 'i'}}
                                    ]
                                }
                            },

                    ]);


        var getWorkActivities = function(activities) {
            return activities.work_activities;
        }
        
        var getScore = function(career, query) {
            var jobTitleSum = 0;
            var careerTitleSum = 0;
            var industrySum = 0;
            var skillSum = 0;


            var careerRegExp = new RegExp(query, 'i');

            if(careerRegExp.test(career.standardized_title)) {
                careerTitleSum += 1;
            }

            _(career.job_titles).each(function(title) {
                if(_.contains(title.name, query)){
                    jobTitleSum += title.count;
                }
            });

            _(career.categories).each(function(industry) {
                if(_.contains(industry.name, query)){
                    industrySum += industry.count;
                }
            });


            _(career.skills).each(function(skill) {
                if(_.contains(skill.name, query)){
                    skillSum += skill.count;
                }
            });

            var jobCount = career.num_ids

            score = careerTitleSum  +
                    (( jobTitleSum/jobCount + skillSum/jobCount + industrySum/jobCount) * jobCount/17692 * 0.5) // scale by prevalence in jobs collection


            return score;
        }

        _(results).each(function(career) {
            if(career.standardized_title) {
                sub.added("careers", career._id, 
                    {standardized_title: career.standardized_title,
                     skills: career.skills.slice(0,5),
                     num_ids: career.num_ids,
                     categories: career.categories,
                     work_activities: _.pick(career.work_activities, "activities")["activities"],
                     score: getScore(career, searchString)});
            }
        });

        sub.ready();

    });


    Meteor.publish('careerProfileResults', function(careerId){
        return Careers.find(careerId);
    })

    Meteor.publish('careerCompareResults', function(careerId1, careerId2){
        return Careers.find({_id:{$in: [careerId1, careerId2]}});
    })

    Meteor.publish('careerSidebarLinks', function(careerName){
        return Careers.find({standardized_title: careerName});
    })


    Meteor.publish('skills', function(){
        return Skills.find({});
    });

    Careers.allow({
        insert: function(){
            return true;
        },
        update: function(){
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

    Meteor.startup(function () {
        Meteor.call('processJobData');
    });	

}	

Meteor.methods({
    "processJobData": processJobData,
});

var mapReduceData = function(value, jobsField) {

	var data = _.chain(_.flatten(_.pluck(value, jobsField)))
			    .groupBy(function(item) {return item; })
			    .map(function(value, key) {
			        var sum = _.reduce(value, function(memo, val) { return memo + 1; }, 0);
			        return {name: key, count: sum};
			    })
			    .filter(function(value,key) {return key != "null";})
			    .sortBy(function(item) {return -item.count;})
			    .value();

	return data;
}


function processJobData() {
	if (Jobs.find({}).count() == 0) {

        // CAREER-LEVEL DATA
        var educationData = JSON.parse(Assets.getText('data/education_data.json'))

        var salaryData = JSON.parse(Assets.getText('data/salary_data.json'))

        var workContextData = JSON.parse(Assets.getText('data/work_context_data.json'))

        var workActivitiesData = JSON.parse(Assets.getText('data/work_activities.json'))


		// DATA FOR JOBS COLLECTION
        var jobs = JSON.parse(Assets.getText('data/jobs_data.json'));

        // TRANSFORMED DATA FOR CAREERS COLLECTION
        var careers = _.chain(jobs)
            .groupBy('standardized_title')
            .map(function(value, key) {
                return {
                    standardized_title: key,

                    skills: mapReduceData(value, "skills"),

                    categories: mapReduceData(value, "categories"),

	                companies: mapReduceData(value, "company"),

                    job_titles: mapReduceData(value, "job_title"),

	                onet_titles: mapReduceData(value, "onet_title"),

	                onet_code: _.uniq(_.flatten(_.pluck(value, "onet_code"))),
									
                    job_ids: _.flatten(_.pluck(value, "job_id")),

                    num_ids: _.flatten(_.pluck(value, "job_id")).length, 

                    education: [],

                    salary: [],

                    work_context: [],

                    work_activities: []

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
            Careers.find().forEach(function(career) {

                var skillNames = _.pluck(career.skills, 'name');

                if(_.contains(skillNames, targetSkill)) {
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
                                career_ids: []
                            }
        }); 

        // INSERT DATA INTO COLLECTIONS

        _.each(jobs, function(job) {
        	Jobs.insert(job);
        });
        console.log('Done importing Jobs');

        _.each(careers, function(career) {
        	Careers.insert(career);
        });  
        console.log('Done importing Careers');

        Careers.find().forEach(function(career) {
            Careers.update(career._id, {$set: {"education": (career.onet_code != null) ? educationData[career.onet_code] : null} });
            Careers.update(career._id, {$set: {"salary": (career.onet_code != null) ? salaryData[career.onet_code] : null } });
            Careers.update(career._id, {$set: {"work_context": (career.onet_code != null) ? workContextData[career.onet_code] : null } });
            Careers.update(career._id, {$set: {"work_activities": workActivitiesData[career.standardized_title] } });
        });    
        console.log('Done updating Careers');

        _.each(skills, function(skill) {
        	Skills.insert(skill);
            // Skills.update( {"name": skill.name}, {$set: {"career_ids": getCareersWithSkill(skill.name)}} );   
        });

        console.log('Done importing data!');
	}
}
