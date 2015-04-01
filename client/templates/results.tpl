<div ng-if="" ng-include="'client/templates/loading.tpl'"></div>

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
      <h3>Careers related to {{searchTerm}}</h3>
    </div>

    <div class="row">
      <div class="col-xs-12" ng-repeat="job in jobs" id="{{job._id}}">
        <div class="result-box card">
          <h4>{{job.title}}</h4>
        </div>
      </div>
    </div>
    
  </div>


</div>
