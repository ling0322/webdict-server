class CandidateController < ApplicationController
    def index
        render :json => Candidate.random_candidate
    end
end
