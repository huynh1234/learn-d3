export default function jsonToNewick(json) {
    function nested(nest){
		var subtree = "";

		if(nest.hasOwnProperty('branchset')){
			var branchset = [];
			nest.branchset.forEach(function(child){
				var subsubtree = nested(child);
				branchset.push(subsubtree);
			});
      var substring = branchset.join();
      if(nest.hasOwnProperty('name')){
        subtree = "("+substring+")" + nest.name;
      }
      if(nest.hasOwnProperty('length')){
        subtree = subtree + ":"+nest.length;
      }
		}
		else{
      var leaf = "";
      if(nest.hasOwnProperty('name')){
        leaf = nest.name;
      }
      if(nest.hasOwnProperty('length')){
        leaf = leaf + ":"+nest.length;
      }
      subtree = subtree + leaf;
		}
		return subtree;
	}
	return nested(json) +";";
}