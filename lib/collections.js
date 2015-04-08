Jobs = new Mongo.Collection('jobs');
Careers = new Mongo.Collection('careers');
Skills = new Mongo.Collection('skills');


if (Meteor.isServer){
    Meteor.publish('jobs', function(){
        // if (id) return Datasets.find({_id: id, user_id: this.userId});
        // if no specific one, return all
        return Jobs.find({});
    });

    Meteor.publish('careers', function(){
        return Careers.find({});
    });

    Meteor.publish('skills', function(){
        return Skills.find({});
    });

    Careers.allow({
        // TODO: add some kind of authentication here
        insert: function(){
            return true;
        },
        update: function(userId, doc){
            return true;
        },
        remove: function(userId, doc){
            return true;
        }
    });

    Jobs.allow({
    	insert: function() {
    		return true;
    	}
    })

    Meteor.startup(function () {
        Meteor.call('processJobData');
    });	
}	

Meteor.methods({
    "processJobData": processJobData,
});

function processJobData() {
	if (Jobs.find({}).count() == 0) {

		 // $http.get('data/test_data.json').success(function(data){
	        var jobs = JSON.parse(Assets.getText('data/test_data.json'));
	        var careers = _.chain(jobs)
	            .groupBy('standardized_title')
	            .map(function(value, key) {
	                return {
	                    standardized_title: key,
	                    skills: _.chain(_.flatten(_.pluck(value, "skills")))
	                                    .groupBy(function(skill) {return skill;})
	                                    .sortBy(function(skill) { return -skill.length;}) //sort descending by frequency
	                                    .flatten()
	                                    .uniq()
	                                    .value(),
	                    categories: _.chain(_.flatten(_.pluck(value, "category")))
	                                    .groupBy(function(cat) {return cat;})
	                                    .sortBy(function(cat) { return -cat.length;}) //sort descending by frequency
	                                    .flatten()
	                                    .uniq()
	                                    .value(),
	                    job_ids: _.flatten(_.pluck(value, "job_id")),
	                    num_ids: _.flatten(_.pluck(value, "job_id")).length
	                }
	            })
	            .value();

	        _.each(jobs, function(job) {
	        	Jobs.insert(job);
	        });

	        _.each(careers, function(career) {
	        	Careers.insert(career);
	        });        

	        console.log(careers);
	}
}
