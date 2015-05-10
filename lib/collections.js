Jobs = new Mongo.Collection('jobs');
Careers = new Mongo.Collection('careers');
CareerSearch = new Mongo.Collection('careerSearch');
Autocomplete = new Mongo.Collection('autocomplete');
// Skills = new Mongo.Collection('skills');


// Use lodash instead of underscore
_ = lodash;

if (Meteor.isServer){

    Meteor.publish('jobs', function(){
        return Jobs.find({}, {fields: {job_id: 1, skills: 1} });
    });

    Meteor.publish('careerResults', function(options, searchString){

        sub = this;

        // exit publish function if searchString is null
        if(searchString == null){
            return;
        } else {
           var searchString = searchString.toLowerCase()
        }

        // split on any number of consecutive whitespace if the string has a length
        var splitString = (searchString != null) ? searchString.split(/\s+/) : [''];
        var regexString = new RegExp(splitString.join('|'));

        results =  Careers.aggregate([
                            {$match: 
                                {$or: [
                                        {'standardized_title' : { $regex : regexString, $options : 'i'}},
                                        {'job_titles.name' : { $regex : regexString, $options : 'i'}},
                                        {'categories.name' : { $regex : regexString, $options : 'i'}},
                                        {'skills.name' : { $regex : regexString, $options : 'i'}},
                                        {'work_activities.activities' : { $regex : regexString, $options : 'i'}},
                                        {'knowledge.name' : { $regex : regexString, $options : 'i'}}
                                    ]
                                }
                            },
                        ]);

        
        var getScore = function(career, query) {
            var jobTitleSum = 0;
            var careerTitleSum = 0;
            var industrySum = 0;
            var skillSum = 0;
            var workActSum = 0;
            var knowledgeSum = 0;

            // whole term on word boundaries
            var queryRegExp = new RegExp('\\b' + query + '\\b', 'i');


            // CAREER TITLE
            // if whole query exactly matches a career title, add 2 points
            if(query == career.standardized_title.toLowerCase()) {
                careerTitleSum += 2;
            // if whole query exactly matches a whole word in the career title, add 1 point
            } else if (queryRegExp.test(career.standardized_title)) {
                careerTitleSum += 1;
            }

            // JOB TITLE
            _(career.job_titles).each(function(title) {

                // if whole query exactly matches a job title, add count for that title
                if(title.name.toLowerCase() == query) {
                    jobTitleSum += title.count;
                    // console.log('TITLE Whole phrase: ', career.standardized_title, title.name, jobTitleSum);
                } else {
                    _(splitString).each(function(term) {

                        termRegExp = new RegExp('\\b' + term + '\\b', 'i');

                        // if this word in the query exactly matches a whole word in the job title, 
                        // add the count normalized by the number of words in the query and title
                        if (termRegExp.test(title.name)) {
                            jobTitleSum += (title.count / title.name.split(/\s+/).length) / (splitString.length);
                            // console.log('TITLE A word: ', career.standardized_title, title.name, jobTitleSum);
                        }
                    });
                }
            });

            // INDUSTRY / CATEGORY
            _(career.categories).each(function(industry) {

                // if whole query exactly matches a category, add count for that title
                if(industry.name.toLowerCase() == query) {
                    industrySum += industry.count;
                    // console.log('INDUSTRY Whole phrase: ', career.standardized_title, industry.name, industrySum);
                } else {
                    _(splitString).each(function(term) {

                        termRegExp = new RegExp('\\b' + term + '\\b', 'i');

                        // if this word in the query exactly matches a whole word in the industry name, 
                        // add the count normalized by the number of words in the query and industry
                        if (termRegExp.test(industry.name)) {
                            industrySum += (industry.count / industry.name.split(/\s+/).length) / (splitString.length);
                            // console.log('INDUSTRY A word: ', career.standardized_title, industry.name, skillSum);
                        }
                    });
                }
            });


            // SKILLS
            _(career.skills).each(function(skill) {

                // if whole query exactly matches a skill, add count for that title
                if(skill.name.toLowerCase() == query) {
                    skillSum += skill.count;
                    // console.log('SKILL Whole phrase: ', career.standardized_title, skill.name, skillSum);
                } else {
                    _(splitString).each(function(term) {

                        termRegExp = new RegExp('\\b' + term + '\\b', 'i');

                        // if this word in the query exactly matches a whole word in the skill name, 
                        // add the count normalized by the number of words in the query and skill
                        if (termRegExp.test(skill.name)) {
                            skillSum += (skill.count / skill.name.split(/\s+/).length) / (splitString.length);
                            // console.log('SKILL A word: ', career.standardized_title, skill.name, skillSum);
                        }
                    });
                }
            });


            // WORK ACTIVITIES
            if(career.work_activities != null) {
                _(career.work_activities.activities).each(function(activity) {
                    if(queryRegExp.test(activity)){
                        workActSum +=  0.1;
                    }
                });
            }


            // KNOWLEDGE
            if(career.knowledge != null) {
                _(career.knowledge).each(function(k) {
                    if(queryRegExp.test(k.name)){
                        knowledgeSum += k.value * 0.1;
                    }
                });
            }


            var jobCount = career.num_ids;

            score = careerTitleSum  + knowledgeSum + workActSum +
                    (( jobTitleSum/jobCount + skillSum/jobCount + industrySum/jobCount) * jobCount/16064); // scale by prevalence in jobs collection

            return score;
        }

        _(results).each(function(career) {
            if(career.standardized_title) {
                sub.added("careerSearch", career._id, 
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

    Meteor.publish('autoCompleteData', function(){

        sub = this;
        
        careers =  Careers.find().fetch();

        var allSkills = [];  
        var allJobTitles = [];
        var careerTitles = [];
        var allCategories = [];
        var allKnowledge = [];

        // get values for each 
        _(careers).each(function(career) {
            _(career.skills).each(function(skill) {
                allSkills.push(skill.name);
            });

            _(career.job_titles).each(function(title) {
                allJobTitles.push(title.name.toLowerCase());
            });

            careerTitles.push(career.standardized_title.toLowerCase());

            _(career.categories).each(function(cat) {
                allCategories.push(cat.name.toLowerCase());
            });

            _(career.knowledge).each(function(know) {
                allKnowledge.push(know.name.toLowerCase());
            });

        });
          
        uniqSkills = _.uniq(allSkills);
        uniqJobTitles = _.uniq(allJobTitles);
        uniqCategories = _.uniq(allCategories);
        uniqKnowledge = _.uniq(allKnowledge);

        searchTerms = _.uniq(careerTitles.concat(uniqCategories, uniqSkills, uniqJobTitles, uniqKnowledge)).sort();

        // 123 is a dummy id value (there is only one document with one field in this client-only collection)
        sub.added("autocomplete", '123', {searchValues: searchTerms});

        sub.ready();

    });


    // Meteor.publish('skills', function() {
    //     return Skills.find({}, {fields: {name: 1}});
    // })

    Meteor.publish('careerProfileResults', function(careerId){
        return Careers.find(careerId);
    });

    Meteor.publish('careerLinkCollection', function(careerNames){    
        return Careers.find({standardized_title:{$in: careerNames}}, {fields: {_id: 1, standardized_title: 1}});
    });

    Meteor.publish('careerCompareResults', function(careerId1, careerId2){
        return Careers.find({_id:{$in: [careerId1, careerId2]}});
    });

    // Meteor.publish('skills', function(){
    //     return Skills.find({});
    // });

    Careers.allow({
        insert: function(){
            return true;
        },
        update: function(){
            return true;
        }
    });

    // Jobs.allow({
    // 	insert: function() {
    // 		return true;
    // 	}
    // });

    // Skills.allow({
    // 	insert: function() {
    // 		return true;
    // 	},
    // 	update: function(){
    //         return true;
    //     }
    // });

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
	if (Careers.find({}).count() == 0) {

        // CAREER-LEVEL DATA
        var educationData = JSON.parse(Assets.getText('data/education_data.json'));

        var salaryData = JSON.parse(Assets.getText('data/salary_data.json'));

        var workContextData = JSON.parse(Assets.getText('data/work_context_data.json'));

        var workActivitiesData = JSON.parse(Assets.getText('data/work_activities.json'));

        var knowledgeDataRaw = JSON.parse(Assets.getText('data/knowledge_data.json'));

        var knowledgeData = _.chain(knowledgeDataRaw)
                             .groupBy(function(item) {return item.onet_code})
                             .value()

        var relatedCareersData = JSON.parse(Assets.getText('data/related_careers_data.json'));


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

                    work_activities: [],

                    knowledge: [],

                    related_careers : []

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


        var getRelatedCareerObjects = function(career) {
            var relatedCareers = []
            relCareers = career.related_careers;
            relCareers.forEach(function(relCareerName) {
                relId = Careers.findOne({standardized_title: relCareerName})._id;
                relatedCareers.push({name: relCareerName, id: relId});
            });
            return relatedCareers;
        }
        

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
            Careers.update(career._id, {$set: {"related_careers": relatedCareersData[career.standardized_title]['related_careers'] } });
            Careers.update(career._id, {$set: {"knowledge": (career.onet_code != null) ? knowledgeData[career.onet_code] : null } });
            
        });    

        Careers.find().forEach(function(career) {
            Careers.update(career._id, {$set: {"related_careers": getRelatedCareerObjects(career)} });
        });

        console.log('Done updating Careers');

        // _.each(skills, function(skill) {
        // 	Skills.insert(skill);
        //     // Skills.update( {"name": skill.name}, {$set: {"career_ids": getCareersWithSkill(skill.name)}} );   
        // });

        console.log('Done importing data!');
	}
}
