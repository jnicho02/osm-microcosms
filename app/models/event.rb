# == Schema Information
#
# Table name: events
#
#  id           :bigint(8)        not null, primary key
#  title        :string           not null
#  moment       :datetime
#  location     :string
#  description  :text
#  microcosm_id :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Event < ApplicationRecord
  belongs_to :microcosm
  has_many :event_attendances
  has_many :event_organizers

  def attendees
    EventAttendance.where(:event_id => id, :intention => "Yes")
  end

  def organizers
    EventOrganizer.where(:event_id => id)
  end
end