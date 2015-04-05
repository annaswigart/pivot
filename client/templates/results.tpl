
<div class="row">

  <div class="col-xs-3">
    <div class="sidebar">
      <div class="highlights card">
        <h4>Highlights</h4>
      </div>
        <div class="history card">
          <h4>History</h4>
        </div>
    </div>
  </div>

  <div class="col-xs-9">

    <div class="row">
      <h3>Careers related to <input type="text" placeholder="Search skills" class="search-box"
      ng-model="searchQuery" ng-model-options="{debounce: 250}"/></h3>
      <div ng-if="resultsLoading" ng-include="'client/templates/loading.tpl'"></div>
    </div>

    <div class="row" ng-if="!resultsLoading">
      <div class="col-xs-12" ng-repeat="career in careers | filter: searchQuery | orderBy: career.num_ids | limitTo: 20">
<!--       <div class="col-xs-12" ng-repeat="job in jobs" id="{{job._id}}">
 -->    <div class="result-box card">
          <h4>{{career.standardized_title}}</h4>
          <div class="row">

            <div class="skills-wrapper col-xs-5">
              Top Skills:
              <ul>
                <li ng-repeat="skill in career.skills | limitTo: 5">{{skill}}</li>
              </ul>
            </div>

            <div class="tags-wrapper col-xs-7">
              <ul>
                <li ng-repeat="category in career.categories | limitTo: 5"><span class="label label-default">{{category}}</span></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
    
  </div>


</div>
