
<div class="row">

  <div class="col-xs-3">
    <div class="sidebar">
      <!-- <div class="highlights card">
        <h4>Highlights</h4>
      </div> -->
        <div class="history card">
          <h4>Recent Searches</h4>
          <ul>
            <li ng-repeat="q in queryStackData track by $index">{{q}}</li>
          </ul>
        </div>
    </div>
  </div>

  <div class="col-xs-9">
    

    <div class="row">
      <!-- <h3>Careers related to <input type="text" placeholder="Search skills" class="search-box"
      ng-model="setQuery" ng-model-options="{debounce: 250}"/></h3> -->
      <form class="form-horizontal" name="resultsQuery" role="form">
      <div class="form-group">
        <label class="search-label col-xs-5">
          Careers related to
        </label>
        <div class="col-xs-5">
          <div class="input-group input-group-lg">
            <input type="text" name="text" class="form-control" ng-model="query"/>
            <span class="input-group-btn">
              <button ng-click="setQuery(query)" class="btn btn-primary" aria-label="search">
                <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </form>
      <div ng-if="resultsLoading" ng-include="'client/templates/loading.tpl'"></div>
    </div>

    <div class="row card" ng-if="!resultsLoading">
<!--       <div class="col-xs-12" ng-repeat="career in (filteredCareers = (careers | orderBy: '-num_ids')) | startFrom: currentPage * pageSize  | limitTo:pageSize"> -->
      <div class="col-xs-12" ng-repeat="career in (filteredCareers = (careers | filter: query)) | startFrom: currentPage * pageSize  | limitTo:pageSize">
      <div class="result-box">
          <h4>{{career.standardized_title}} ({{career.num_ids}})</h4>
          <div class="row">

            <div class="skills-wrapper col-xs-5">
              Top Skills:
              <ul>
                <li ng-repeat="skill in career.skills | limitTo: 5">{{skill.name}}</li>
              </ul>
            </div>

            <div class="tags-wrapper col-xs-7">
              <ul>
                <li ng-repeat="category in career.categories | limitTo: 5"><span class="label label-default">{{category.name}}</span></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
        <button ng-repeat="i in getNumberAsArray(numberOfPages()) track by $index" ng-click="setCurrentPage($index)">{{$index + 1}}</button>
    </div>

  </div>
</div>
